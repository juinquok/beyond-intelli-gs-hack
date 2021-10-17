module "lb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 5.0"
  name    = "${var.namespace}-gs-lb"

  load_balancer_type = "application"

  vpc_id          = module.vpc.vpc_id
  subnets         = module.vpc.public_subnets
  security_groups = [aws_security_group.alb_sg.id]

  target_groups = [
    {
      name_prefix      = "finn"
      backend_protocol = "HTTP"
      backend_port     = 8080
      target_type      = "ip"
      health_check = {
        enabled  = true
        interval = 30
        path     = "/health"
        port     = 8080
        protocol = "HTTP"
      }
    },
    {
      name_prefix      = "edu"
      backend_protocol = "HTTP"
      backend_port     = 8080
      target_type      = "ip"
      health_check = {
        enabled  = true
        interval = 30
        path     = "/health"
        port     = 8080
        protocol = "HTTP"
      }
    },
    {
      name_prefix      = "user"
      backend_protocol = "HTTP"
      backend_port     = 8080
      target_type      = "ip"
      health_check = {
        enabled  = true
        interval = 30
        path     = "/health"
        port     = 8080
        protocol = "HTTP"
      }
    }
  ]

  https_listeners = [{
    port            = 443
    protocol        = "HTTPS"
    certificate_arn = aws_acm_certificate_validation.api_cert.certificate_arn
    authenticate_cognito = {
      on_unauthenticated_request = "authenticate"
      user_pool_arn              = "arn:aws:cognito-idp:us-east-1:809247286407:userpool/us-east-1_ZzSuA0ZTw"
      user_pool_client_id        = "4adospot2k0scgg76meu7p101h"
      user_pool_domain           = "gs-maverick-finance.tech"
    }
  }]

  http_tcp_listeners = [
    {
      port        = 80
      protocol    = "HTTP"
      action_type = "redirect"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  ]
}

resource "aws_lb_listener_rule" "gs_hack_finnproducts" {
  listener_arn = module.lb.https_listener_arns[0]

  action {
    type             = "forward"
    target_group_arn = module.lb.target_group_arns[0]
  }

  condition {
    path_pattern {
      values = ["/finn/*"]
    }
  }
}

resource "aws_lb_listener_rule" "gs_hack_education" {
  listener_arn = module.lb.https_listener_arns[0]

  action {
    type             = "forward"
    target_group_arn = module.lb.target_group_arns[1]
  }

  condition {
    path_pattern {
      values = ["/edu/*"]
    }
  }
}

resource "aws_lb_listener_rule" "gs_hack_user" {
  listener_arn = module.lb.https_listener_arns[0]

  action {
    type             = "forward"
    target_group_arn = module.lb.target_group_arns[2]
  }

  condition {
    path_pattern {
      values = ["/user/*"]
    }
  }
}
