'use strict';

const aws = require('aws-sdk');

const isSimulate = process.env.SERVERLESS_SIMULATE === 'true';
const isNodeTest = process.env.NODE_ENV === 'test';

if (isSimulate) {
	aws.config.lambda = {
		region: process.env.AWS_REGION,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		endpoint: process.env.SERVERLESS_SIMULATE_LAMBDA_ENDPOINT
	};
	aws.config.dynamodb = {
		region: process.env.AWS_REGION,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		endpoint: process.env.SERVERLESS_SIMULATE_LAMBDA_ENDPOINT.replace(
			'4000',
			'8000'
		)
	};
} else if (isNodeTest) {
	aws.config.lambda = {
		region: 'us-east-1',
		accessKeyId: 'SOME_ACCESS_KEY_ID',
		secretAccessKey: 'SOME_SECRET_ACCESS_KEY',
		endpoint: 'http://localhost:4000'
	};
	aws.config.dynamodb = {
		region: 'us-east-1',
		accessKeyId: 'SOME_ACCESS_KEY_ID',
		secretAccessKey: 'SOME_SECRET_ACCESS_KEY',
		endpoint: 'http://localhost:8000'
	};
}

module.exports = aws;
