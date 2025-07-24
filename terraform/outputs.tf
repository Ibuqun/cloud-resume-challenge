output "api_gateway_url" {
  value = "${aws_api_gateway_stage.api_stage.invoke_url}/visitors"
}

output "custom_domain_url" {
  value = "https://${aws_api_gateway_domain_name.api_domain.domain_name}/visitors"
}

output "regional_domain_name" {
  value = aws_api_gateway_domain_name.api_domain.regional_domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.website.id
}
