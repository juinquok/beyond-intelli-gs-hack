resource "aws_service_discovery_service" "finnedu" {
  name         = "finnedu"
  namespace_id = aws_service_discovery_private_dns_namespace.gs_hack.id

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.gs_hack.id

    dns_records {
      ttl  = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

resource "aws_ecs_service" "gs_hack_education" {
  name    = "gs_hack_education"
  cluster = aws_ecs_cluster.gs_cluster.id

  task_definition = aws_ecs_task_definition.gs_hack_education.arn

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  desired_count                      = 0

  service_registries {
    registry_arn = aws_service_discovery_service.finnedu.arn
  }

  load_balancer {
    target_group_arn = module.lb.target_group_arns[1]
    container_name   = "gs_hack_education"
    container_port   = 8080
  }

  network_configuration {
    security_groups  = [aws_security_group.cluster_entry.id]
    subnets          = module.vpc.private_subnets
    assign_public_ip = true
  }

  launch_type         = "FARGATE"
  scheduling_strategy = "REPLICA"

  // This wull be updated by CI/CD
  lifecycle {
    ignore_changes = [desired_count, task_definition]
  }
}

// Using this as a wrapper for the cloudposse version ref to online
resource "aws_ecs_task_definition" "gs_hack_education" {
  family = "gs_hack_education"

  network_mode       = "awsvpc"
  task_role_arn      = aws_iam_role.task_role.arn
  execution_role_arn = aws_iam_role.execution_role.arn
  cpu                = "256"
  memory             = "512"

  container_definitions = <<-EOF
[
  ${module.ecs_container_definition_gs_hack_education.json_map_encoded}
]
EOF

  requires_compatibilities = ["FARGATE"]

  // This wull be updated by CI/CD
  lifecycle {
    ignore_changes = [container_definitions]
  }
}

module "ecs_container_definition_gs_hack_education" {
  source  = "cloudposse/ecs-container-definition/aws"
  version = "0.58.1"

  container_name  = "gs_hack_education"
  container_image = "809247286407.dkr.ecr.us-east-1.amazonaws.com/gs_hack_education:latest"

  log_configuration = {
    logDriver = "awslogs"
    options = {
      awslogs-group         = aws_cloudwatch_log_group.gs_hack.name
      awslogs-region        = var.aws_region
      awslogs-stream-prefix = "ecs-api"
    }
  }

  essential = true

  port_mappings = [
    {
      hostPort      = 8080
      containerPort = 8080
      protocol      = "tcp"
    }
  ]

  environment = []
  secrets = [{
    name      = "NEWS_API_KEY"
    valueFrom = aws_secretsmanager_secret.news_api_key.arn
  }]
}

# Can't use this with educate!!!!
# resource "aws_appautoscaling_target" "gs_api" {
#   min_capacity = 2
#   max_capacity = 5

#   resource_id = "service/${aws_ecs_cluster.gs_cluster.name}/${aws_ecs_service.gs_api.name}"

#   scalable_dimension = "ecs:service:DesiredCount"
#   service_namespace  = "ecs"
# }

# resource "aws_appautoscaling_policy" "api" {
#   name        = "gs_api_autoscale"
#   policy_type = "TargetTrackingScaling"

#   resource_id        = aws_appautoscaling_target.gs_api.resource_id
#   scalable_dimension = aws_appautoscaling_target.gs_api.scalable_dimension
#   service_namespace  = aws_appautoscaling_target.gs_api.service_namespace

#   target_tracking_scaling_policy_configuration {
#     predefined_metric_specification {
#       predefined_metric_type = "ALBRequestCountPerTarget"
#       resource_label         = "${module.lb.this_lb_arn_suffix}/${module.lb.target_group_arn_suffixes[0]}"
#     }

#     target_value       = 50
#     scale_in_cooldown  = 400
#     scale_out_cooldown = 200
#     disable_scale_in   = false
#   }
# }
