resource "aws_cloudwatch_log_group" "gs_hack" {
  name              = "/hack/gs_hack"
  retention_in_days = 5
}

resource "aws_cloudwatch_log_stream" "gs_hack-stream" {
  name           = "/hack/gs_hack_stream"
  log_group_name = aws_cloudwatch_log_group.gs_hack.name
}