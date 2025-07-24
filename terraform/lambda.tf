# Lambda function for get count - optimized for cost
resource "aws_lambda_function" "get_count" {
  filename         = "../aws-api-project/src/lambda/getVisitorCount.zip"
  function_name    = "getVisitorCount"
  role            = aws_iam_role.lambda_role.arn
  handler         = "getVisitorCount.handler"
  runtime         = "nodejs18.x"
  source_code_hash = filebase64sha256("../aws-api-project/src/lambda/getVisitorCount.zip")
  
  # Cost optimizations
  memory_size = 128  # Minimum memory
  timeout     = 3    # Reduced timeout
  
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.visitor_counter.name
    }
  }
}

# Lambda function for update count - optimized for cost
resource "aws_lambda_function" "update_count" {
  filename         = "../aws-api-project/src/lambda/updateVisitorCount.zip"
  function_name    = "updateVisitorCount"
  role            = aws_iam_role.lambda_role.arn
  handler         = "updateVisitorCount.handler"
  runtime         = "nodejs18.x"
  source_code_hash = filebase64sha256("../aws-api-project/src/lambda/updateVisitorCount.zip")
  
  # Cost optimizations
  memory_size = 128  # Minimum memory
  timeout     = 3    # Reduced timeout

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.visitor_counter.name
    }
  }
}

# CloudWatch logs removed to reduce costs
# Lambda functions will use default log groups with automatic cleanup

# Lambda permission for API Gateway GET
resource "aws_lambda_permission" "api_gateway_get" {
  statement_id  = "AllowAPIGatewayInvokeGet"
  action        = "lambda:InvokeFunction"
  function_name = "getVisitorCount"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.visitor_api.execution_arn}/*/GET/visitors"
}

# Lambda permission for API Gateway POST
resource "aws_lambda_permission" "api_gateway_post" {
  statement_id  = "AllowAPIGatewayInvokePost"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_count.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.visitor_api.execution_arn}/*/*"
}