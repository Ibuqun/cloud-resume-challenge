# Origin Access Control for S3
resource "aws_cloudfront_origin_access_control" "website_oac" {
  name                              = "www.ibukuntaiwo.com-oac"
  description                       = "OAC for www.ibukuntaiwo.com"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled    = true
  default_root_object = "index.html"
  price_class        = "PriceClass_100"

  origin {
    domain_name              = data.aws_s3_bucket.frontend_bucket.bucket_domain_name
    origin_id                = "S3-www.ibukuntaiwo.com"
    origin_access_control_id = aws_cloudfront_origin_access_control.website_oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-www.ibukuntaiwo.com"
    viewer_protocol_policy = "redirect-to-https"
    compress              = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert_validation.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  aliases = ["ibukuntaiwo.com", "www.ibukuntaiwo.com", "resume.ibukuntaiwo.com"]
}