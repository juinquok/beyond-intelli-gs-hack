resource "aws_ecs_cluster" "gs_cluster" {
  name = "${var.namespace}-ecs-gs_cluster"
}