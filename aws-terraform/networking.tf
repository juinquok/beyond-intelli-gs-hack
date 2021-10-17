data "aws_availability_zones" "available" {}

module "vpc" {
  source          = "terraform-aws-modules/vpc/aws"
  name            = "${var.namespace}-vpc"
  cidr            = "10.0.0.0/16"
  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  //assign_generated_ipv6_cidr_block = true
  //create_database_subnet_group = true
  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  enable_dns_hostnames   = true
  enable_dns_support     = true
}

resource "aws_service_discovery_private_dns_namespace" "gs_hack" {
  name = "services.gshack"
  vpc  = module.vpc.vpc_id
}

data "aws_vpc_endpoint_service" "secret_manager" {
  service = "secretsmanager"
}

resource "aws_vpc_endpoint" "secret_manager" {
  vpc_id             = module.vpc.vpc_id
  service_name       = data.aws_vpc_endpoint_service.secret_manager.service_name
  vpc_endpoint_type  = "Interface"
  security_group_ids = [aws_security_group.ssm_private.id]
}

// Security Group for Secret Manager VPC Endpoint
resource "aws_security_group" "ssm_private" {
  name        = "${var.namespace}-ssm_private"
  description = "Allow SSH and ALB inbound traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "HTTPS to VPC Endpoint"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.cluster_entry.id]
  }

  ingress {
    description     = "HTTP to VPC Endpoint"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.cluster_entry.id]
  }

  egress {
    description = "All traffic out"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.namespace}-ssm_private"
  }
}

// All traffic to LB
resource "aws_security_group" "alb_sg" {
  name        = "${var.namespace}-alb_sg"
  description = "Allow all inbound traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTP Access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS Access"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All traffic out"
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.namespace}-alb_sg"
  }

}

// LB to Cluster
resource "aws_security_group" "cluster_entry" {
  name        = "${var.namespace}-cluster_entry"
  description = "Allow SSH and ALB inbound traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "HTTPS from LB"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.allow_ssh_pub.id]
  }

  ingress {
    description     = "HTTP from LB"
    protocol        = "tcp"
    from_port       = 80
    to_port         = 80
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    description     = "Container Port from LB"
    protocol        = "tcp"
    from_port       = 8080
    to_port         = 8080
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description = "All traffic out"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.namespace}-cluster_entry"
  }
}


// FOR EC2 Debugging Instances Only //

// SG to allow SSH connections from anywhere for Bastion
resource "aws_security_group" "allow_ssh_pub" {
  name        = "${var.namespace}-allow_ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "SSH from the internet"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All traffic out"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.namespace}-allow_ssh_pub"
  }
}

resource "aws_security_group" "private_from_bastion" {
  name        = "${var.namespace}-private_from_bastion"
  description = "Allow all inbound traffic from bastion"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "SSH only from internal VPC clients"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.allow_ssh_pub.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.namespace}-private_from_bastion"
  }
}
