resource "aws_api_gateway_rest_api" "visitor_api" {
  name        = "visitor-counter-api"
  description = "API for visitor counter"
}

resource "aws_api_gateway_resource" "visitor_resource" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  parent_id   = aws_api_gateway_rest_api.visitor_api.root_resource_id
  path_part   = "visitors"
}

resource "aws_api_gateway_method" "get_method" {
  rest_api_id   = aws_api_gateway_rest_api.visitor_api.id
  resource_id   = aws_api_gateway_resource.visitor_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post_method" {
  rest_api_id   = aws_api_gateway_rest_api.visitor_api.id
  resource_id   = aws_api_gateway_resource.visitor_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = aws_api_gateway_rest_api.visitor_api.id
  resource_id   = aws_api_gateway_resource.visitor_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  resource_id = aws_api_gateway_resource.visitor_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  resource_id = aws_api_gateway_resource.visitor_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = aws_api_gateway_method_response.options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

resource "aws_api_gateway_integration" "get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.visitor_api.id
  resource_id             = aws_api_gateway_resource.visitor_resource.id
  http_method             = aws_api_gateway_method.get_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:590183801390:function:getVisitorCount/invocations"
}

resource "aws_api_gateway_integration" "post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.visitor_api.id
  resource_id             = aws_api_gateway_resource.visitor_resource.id
  http_method             = aws_api_gateway_method.post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${aws_lambda_function.update_count.arn}/invocations"
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  resource_id = aws_api_gateway_resource.visitor_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  
  depends_on = [
    aws_api_gateway_integration.get_integration,
    aws_api_gateway_integration.post_integration,
    aws_api_gateway_integration.options_integration,
    aws_api_gateway_integration_response.get_integration_response,
    aws_api_gateway_integration_response.post_integration_response,
    aws_api_gateway_integration_response.options_integration_response
  ]

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.visitor_resource.id,
      aws_api_gateway_method.get_method.id,
      aws_api_gateway_method.post_method.id,
      aws_api_gateway_method.options_method.id,
      aws_api_gateway_integration.get_integration.id,
      aws_api_gateway_integration.post_integration.id,
      aws_api_gateway_integration.options_integration.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id  = aws_api_gateway_rest_api.visitor_api.id
  stage_name   = "prod"
  
  # Cost optimization: disable expensive features
  xray_tracing_enabled = false
}

# Custom domain mapping for API Gateway
resource "aws_api_gateway_domain_name" "api_domain" {
  domain_name              = "api.ibukuntaiwo.com"  # Changed to API subdomain
  regional_certificate_arn = aws_acm_certificate_validation.cert_validation.certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_base_path_mapping" "api_mapping" {
  api_id      = aws_api_gateway_rest_api.visitor_api.id
  stage_name  = aws_api_gateway_stage.api_stage.stage_name
  domain_name = aws_api_gateway_domain_name.api_domain.domain_name
}

# Add CORS Response for GET method
resource "aws_api_gateway_method_response" "get_200" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  resource_id = aws_api_gateway_resource.visitor_resource.id
  http_method = aws_api_gateway_method.get_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Headers" = true
  }
}

# Add CORS method response for POST
resource "aws_api_gateway_method_response" "post_200" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  resource_id = aws_api_gateway_resource.visitor_resource.id
  http_method = aws_api_gateway_method.post_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Headers" = true
  }
}

# Add CORS Integration Response for GET method
resource "aws_api_gateway_integration_response" "get_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  resource_id = aws_api_gateway_resource.visitor_resource.id
  http_method = aws_api_gateway_method.get_method.http_method
  status_code = aws_api_gateway_method_response.get_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
  }

  depends_on = [
    aws_api_gateway_method.get_method,
    aws_api_gateway_integration.get_integration
  ]
}

# Add CORS Integration Response for POST method
resource "aws_api_gateway_integration_response" "post_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.visitor_api.id
  resource_id = aws_api_gateway_resource.visitor_resource.id
  http_method = aws_api_gateway_method.post_method.http_method
  status_code = aws_api_gateway_method_response.post_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
  }

  depends_on = [
    aws_api_gateway_method.post_method,
    aws_api_gateway_integration.post_integration
  ]
}