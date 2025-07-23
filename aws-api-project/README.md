# AWS API Project

This project is designed to create an API using AWS API Gateway and Lambda services. It allows a web application to communicate with a database without direct interaction with DynamoDB from the JavaScript code.

## Project Structure

```
aws-api-project
├── src
│   ├── lambda
│   │   ├── getVisitorCount.js
│   │   └── updateVisitorCount.js
│   └── utils
│       └── dynamodb.js
├── template.yaml
├── package.json
├── jest.config.js
├── tests
│   └── unit
│       └── getVisitorCount.test.js
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aws-api-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Deploy the API:**
   Use the AWS SAM CLI to build and deploy the application.
   ```bash
   sam build
   sam deploy --guided
   ```

## Usage

- The API provides endpoints to get and update the visitor count.
- The `getVisitorCount` Lambda function retrieves the current visitor count from the database.
- The `updateVisitorCount` Lambda function updates the visitor count based on incoming requests.

## Testing

Unit tests are provided for the `getVisitorCount` Lambda function. To run the tests, use the following command:

```bash
npm test
```

## License

This project is licensed under the MIT License.