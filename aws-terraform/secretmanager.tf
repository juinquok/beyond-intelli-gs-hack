resource "aws_kms_key" "default" {
  description             = "Default Key"
  deletion_window_in_days = 7
}

resource "aws_secretsmanager_secret" "finn_token" {
  name       = "GS_HACK_FINN_TOKEN"
  kms_key_id = aws_kms_key.default.key_id
}

resource "aws_secretsmanager_secret_version" "finn_token" {
  secret_id     = aws_secretsmanager_secret.finn_token.id
  secret_string = "<INSERT FINNHUB TOKEN HERE>"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret" "news_api_key" {
  name       = "GS_HACK_NEWS_API_KEY"
  kms_key_id = aws_kms_key.default.key_id
}

resource "aws_secretsmanager_secret_version" "news_api_key" {
  secret_id     = aws_secretsmanager_secret.news_api_key.id
  secret_string = "<INSERT NEWSHUB TOKEN HERE>"

  lifecycle {
    ignore_changes = [secret_string]
  }
}
