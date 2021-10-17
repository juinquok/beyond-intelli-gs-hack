module "dynamo_user_db" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name         = "${var.namespace}-user_db"
  billing_mode = "PROVISIONED"

  hash_key = "cognitoID"

  attributes = [
    {
      name = "cognitoID"
      type = "S"
    }
  ]

  read_capacity  = 5
  write_capacity = 5

  autoscaling_read = {
    target_value = 50
    max_capacity = 30
  }

  autoscaling_write = {
    target_value = 50
    max_capacity = 10
  }
}