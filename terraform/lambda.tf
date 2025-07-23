# Lambda function for get count
resource "aws_lambda_function" "get_count" {
  filename         = "../aws-api-project/src/lambda/getVisitorCount.zip"
  function_name    = "getVisitorCount"
  role            = aws_iam_role.lambda_role.arn
  handler         = "getVisitorCount.handler"
  runtime         = "nodejs18.x"
  source_code_hash = filebase64sha256("../aws-api-project/src/lambda/getVisitorCount.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.visitor_counter.name
    }
  }
}

# Lambda function for update count
resource "aws_lambda_function" "update_count" {
  filename         = "../aws-api-project/src/lambda/updateVisitorCount.zip"
  function_name    = "updateVisitorCount"
  role            = aws_iam_role.lambda_role.arn
  handler         = "updateVisitorCount.handler"
  runtime         = "nodejs18.x"
  source_code_hash = filebase64sha256("../aws-api-project/src/lambda/updateVisitorCount.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.visitor_counter.name
    }
  }
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.get_count.function_name}"
  retention_in_days = 14
}

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