# Reference existing S3 bucket
data "aws_s3_bucket" "frontend_bucket" {
  bucket = "www.ibukuntaiwo.com"
}

# Upload frontend files
resource "aws_s3_object" "index_html" {
  bucket       = data.aws_s3_bucket.frontend_bucket.id
  key          = "index.html"
  source       = "../index.html"
  content_type = "text/html"
  etag         = filemd5("../index.html")
}

resource "aws_s3_object" "script_js" {
  bucket       = data.aws_s3_bucket.frontend_bucket.id
  key          = "script.js"
  source       = "../script.js"
  content_type = "application/javascript"
  etag         = filemd5("../script.js")
}

resource "aws_s3_object" "style_css" {
  bucket       = data.aws_s3_bucket.frontend_bucket.id
  key          = "style.css"  # Fixed typo from "styls.css" to "style.css"
  source       = "../style.css"
  content_type = "text/css"
  etag         = filemd5("../style.css")
}

# Upload resume PDF
resource "aws_s3_object" "resume_pdf" {
  bucket       = data.aws_s3_bucket.frontend_bucket.id
  key          = "Ibukunoluwa_Taiwo.pdf"
  source       = "../Ibukunoluwa_Taiwo.pdf"
  content_type = "application/pdf"
  etag         = filemd5("../Ibukunoluwa_Taiwo.pdf")
}

# Upload images directory
resource "aws_s3_object" "images" {
  for_each = fileset("../images", "**/*")

  bucket = data.aws_s3_bucket.frontend_bucket.id
  key    = "images/${each.value}"
  source = "../images/${each.value}"
  etag   = filemd5("../images/${each.value}")

  content_type = lookup({
    "png"  = "image/png",
    "jpg"  = "image/jpeg",
    "jpeg" = "image/jpeg",
    "gif"  = "image/gif",
    "svg"  = "image/svg+xml"
  }, split(".", each.value)[1], "binary/octet-stream")
}

# S3 bucket policy for CloudFront OAC access
resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = data.aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipalReadOnly"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${data.aws_s3_bucket.frontend_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
          }
        }
      }
    ]
  })
}

# Add these to your existing outputs
output "frontend_files" {
  description = "List of uploaded frontend files"
  value = {
    html = aws_s3_object.index_html.key
    js   = aws_s3_object.script_js.key
    css  = aws_s3_object.style_css.key
  }
}