# ACM Certificate
resource "aws_acm_certificate" "cert" {
  domain_name       = "ibukuntaiwo.com"
  validation_method = "DNS"

  subject_alternative_names = ["*.ibukuntaiwo.com"]

  tags = {
    Environment = "prod"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# DNS Validation
resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# Route 53 record for certificate validation
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
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
  zone_id         = aws_route53_zone.main.zone_id  # Changed from data source to resource reference
}