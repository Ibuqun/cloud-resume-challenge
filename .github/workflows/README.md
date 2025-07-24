# GitHub Actions Deployment Workflow

This directory contains the GitHub Actions workflow for automated deployment of the Cloud Resume Challenge.

## Workflow Overview

The `deploy.yml` workflow automatically:

1. **Validates** infrastructure changes with Terraform plan
2. **Deploys** infrastructure updates using Terraform apply
3. **Uploads** website files (HTML, CSS, JS, images) to S3
4. **Invalidates** CloudFront cache for immediate updates
5. **Tests** and updates Lambda functions
6. **Provides** deployment summary with URLs

## Trigger Conditions

- **Push to main branch**: Full deployment including Terraform apply
- **Pull requests**: Validation only (Terraform plan)

## Required Repository Secrets

Add these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### AWS Credentials
```
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
```

### IAM Permissions Required

The AWS credentials need the following permissions:

#### S3 Permissions
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`
- `s3:ListBucket`

#### CloudFront Permissions  
- `cloudfront:CreateInvalidation`
- `cloudfront:GetDistribution`

#### Lambda Permissions
- `lambda:UpdateFunctionCode`
- `lambda:GetFunction`

#### DynamoDB Permissions
- `dynamodb:DescribeTable`
- `dynamodb:GetItem`
- `dynamodb:PutItem` 
- `dynamodb:UpdateItem`

#### Terraform State Permissions
- `s3:*` (for Terraform state bucket if using remote state)
- `dynamodb:*` (for Terraform state locking if configured)

## Workflow Steps Breakdown

### 1. Code Checkout
Uses `actions/checkout@v4` to get the latest code

### 2. AWS Configuration  
Uses `aws-actions/configure-aws-credentials@v4` with repository secrets

### 3. Terraform Setup
Uses `hashicorp/setup-terraform@v3` with version 1.5.0

### 4. Infrastructure Validation
Runs `terraform plan` for all branches

### 5. Infrastructure Deployment
Runs `terraform apply` only on main branch pushes

### 6. Cache Invalidation
Invalidates CloudFront cache using the distribution ID from Terraform output

### 7. Lambda Testing & Deployment
- Runs `npm test` to validate Lambda functions
- Packages and updates Lambda functions on main branch

## Monitoring Deployments

### GitHub Actions Tab
Monitor workflow runs in the "Actions" tab of your repository

### Deployment Outputs
Each successful deployment shows:
- ✅ Infrastructure status
- 🌐 Website URL: https://ibukuntaiwo.com
- 🔗 API URL: https://api.ibukuntaiwo.com/visitors

### AWS CloudWatch
Monitor Lambda function logs and API Gateway metrics

## Troubleshooting

### Common Issues

#### 1. AWS Credentials Error
```
Error: could not retrieve credentials
```
**Solution**: Verify AWS secrets are correctly set in repository settings

#### 2. Terraform State Lock
```  
Error: state is locked
```
**Solution**: Check DynamoDB state lock table or wait for concurrent operation to complete

#### 3. CloudFront Invalidation Timeout
```
Error: distribution not found
```
**Solution**: Verify CloudFront distribution ID in Terraform outputs

#### 4. Lambda Update Failed
```
Error: function not found
```
**Solution**: Ensure Lambda functions exist and names match in workflow

### Debugging Steps

1. Check workflow logs in GitHub Actions tab
2. Verify AWS permissions using AWS CLI locally
3. Test Terraform commands locally in `terraform/` directory
4. Validate Lambda functions locally with `npm test`

## Customization

### Modify Deployment Triggers
Edit the `on:` section in `deploy.yml`:

```yaml
on:
  push:
    branches: [ main, staging ]  # Add more branches
  schedule:
    - cron: '0 2 * * 0'  # Weekly deployment
```

### Add Environment-Specific Deployments
Create separate workflows for different environments:
- `deploy-staging.yml`
- `deploy-production.yml`

### Custom Notification
Add Slack/Discord notifications:

```yaml
- name: Notify Deployment
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```