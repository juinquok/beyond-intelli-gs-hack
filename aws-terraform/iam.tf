resource "aws_iam_role" "task_role" {
  name = "ECS_TASK"

  assume_role_policy = data.aws_iam_policy_document.ecs_tasks.json
}

resource "aws_iam_role" "execution_role" {
  name = "ECS_EXECUTION"

  assume_role_policy = data.aws_iam_policy_document.ecs_tasks.json
}

data "aws_iam_policy_document" "ecs_tasks" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "ecs_cluster" {
  name   = "gs-cluster-policy"
  policy = data.aws_iam_policy_document.ecs_cluster.json
}

data "aws_iam_policy_document" "ecs_cluster" {
  statement {
    sid    = "DeployService"
    effect = "Allow"

    actions = [
      "ecs:UpdateService",
      "ecs:DescribeServices",
      "ecs:DescribeTaskDefinition"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "RegisterTaskDefinition"
    effect = "Allow"

    actions = [
      "ecs:RegisterTaskDefinition"
    ]

    resources = ["*"]
  }

  statement {
    sid    = "PassRolesInTaskDefinition"
    effect = "Allow"

    actions = [
      "iam:PassRole"
    ]

    resources = [
      aws_iam_role.execution_role.arn,
      aws_iam_role.task_role.arn
    ]
  }
}

resource "aws_iam_role_policy" "task" {
  name = "GS_HACK_TASK_ROLE"
  role = aws_iam_role.task_role.id

  policy = data.aws_iam_policy_document.execution.json
}

resource "aws_iam_role_policy" "execution" {
  name = "GS_HACK_EXECUTION_ROLE"
  role = aws_iam_role.execution_role.id

  policy = data.aws_iam_policy_document.execution.json
}

data "aws_iam_policy_document" "execution" {
  statement {
    effect = "Allow"
    actions = [
      "ec2:DescribeTags",
      "ecs:DeregisterContainerInstance",
      "ecs:DiscoverPollEndpoint",
      "ecs:Poll",
      "ecs:RegisterContainerInstance",
      "ecs:StartTelemetrySession",
      "ecs:UpdateContainerInstancesState",
      "ecs:Submit*",
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "kms:Decrypt",
      "secretsmanager:GetSecretValue"
    ]
    resources = [
      aws_kms_key.default.arn,
      aws_secretsmanager_secret.finn_token.arn
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem"
    ]

    resources = [
      module.dynamo_user_db.dynamodb_table_arn
    ]
  }
}
