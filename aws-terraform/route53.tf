resource "aws_route53_zone" "gs_hack" {
  name          = var.domain
  force_destroy = true
}

resource "aws_route53_record" "web" {
  zone_id = aws_route53_zone.gs_hack.zone_id
  name    = var.api_domain
  type    = "A"

  alias {
    name                   = module.lb.this_lb_dns_name
    zone_id                = module.lb.this_lb_zone_id
    evaluate_target_health = false
  }
}
resource "aws_acm_certificate" "api" {
  domain_name       = var.api_domain
  validation_method = "DNS"
  tags = {
    app = "${var.namespace}"
  }
}

resource "aws_acm_certificate" "web" {
  domain_name       = var.domain
  validation_method = "DNS"
  tags = {
    app = "${var.namespace}"
  }
}

resource "aws_acm_certificate" "auth" {
  domain_name       = var.auth_domain
  validation_method = "DNS"
  tags = {
    app = "${var.namespace}"
  }
}

resource "aws_acm_certificate_validation" "api_cert" {
  certificate_arn         = aws_acm_certificate.api.arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert_validation : record.fqdn]
}

resource "aws_route53_record" "api_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.gs_hack.zone_id
}

resource "aws_acm_certificate_validation" "web_cert" {
  certificate_arn         = aws_acm_certificate.web.arn
  validation_record_fqdns = [for record in aws_route53_record.web_cert_validation : record.fqdn]
}

resource "aws_route53_record" "web_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.web.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.gs_hack.zone_id
}

resource "aws_acm_certificate_validation" "auth_cert" {
  certificate_arn         = aws_acm_certificate.auth.arn
  validation_record_fqdns = [for record in aws_route53_record.auth_cert_validation : record.fqdn]
}

resource "aws_route53_record" "auth_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.auth.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.gs_hack.zone_id
}
