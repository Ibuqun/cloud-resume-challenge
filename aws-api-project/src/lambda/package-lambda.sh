#!/bin/bash

# Clean up any existing artifacts
rm -rf package
rm -f getVisitorCount.zip

# Create a fresh package directory
mkdir -p package/utils

# Copy the Lambda handler and utils
cp getVisitorCount.js package/
cp ../utils/dynamodb.js package/utils/
# Copy node_modules for aws-sdk
cp -r node_modules package/

# Create the zip file from the package directory
cd package
zip -r ../getVisitorCount.zip .
cd ..

# Clean up the temporary directory
rm -rf package

echo "Lambda package created successfully: getVisitorCount.zip"
