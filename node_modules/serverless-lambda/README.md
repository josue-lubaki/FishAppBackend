# serverless-lambda [![Build Status](https://travis-ci.org/Hoishin/serverless-lambda.svg?branch=master)](https://travis-ci.org/Hoishin/serverless-lambda) [![codecov](https://codecov.io/gh/Hoishin/serverless-lambda/badge.svg?branch=master)](https://codecov.io/gh/Hoishin/serverless-lambda?branch=master)

> Easy Lambda + DynamoDB development and testing with Serverless Framework. Automatically configure SDK config according to environment variables.

## Prerequisites

- [nvm](https://github.com/creationix/nvm#install-script) or Node 6.10.3 installed
- Docker

## Install

```sh
npm install --save serverless-lambda
```

## Setting up

Make sure you are using Node v6.10.3

```sh
node --version
# If not 6.10.3
nvm install 6.10.3
```

Install Serverless Framework (globally) and its plugins (locally)

```sh
npm install --global serverless
npm install --save-dev serverless-dynamodb-local serverless-offline serverless-plugin-simulate
```

Download the Docker image that will be used to simulate Lambda

```sh
docker pull lambci/lambda:nodejs6.10
```

Install DynamoDB

```sh
sls dynamodb install
```

## Start emulator

You need to have 3 processes simultaneously. Open 3 terminals and run the commands below in order.

```sh
sls simulate lambda -p 4000
```

```sh
sls simulate apigateway -p 5000 --lambda-port 4000
```

```sh
sls dynamodb start -p 8000 --seed=development
```

## Usage

### AWS SDK

```js
const AWS = require('aws-sdk');
// Require serverless-lambda for side-effect
// This will configure AWS object according to environment
require('serverless-lambda');

const lambda = new AWS.Lambda();
lambda.invoke(someParams);

const dynamodb = new AWS.DynamoDB.DocumentClient();
dynamodb.get(someParams);
```

or you can require `AWS` object from this package

```js
// This AWS is exactly same object as original require('aws-sdk')
const AWS = require('serverless-lambda');

const lambda = new AWS.Lambda();
lambda.invoke(someParams);

const dynamodb = new AWS.DynamoDB.DocumentClient();
dynamodb.get(someParams);
```

### Invoke Functions from CLI

Use Serverless commands

```
$ sls invoke local
Plugin: Invoke
invoke local .................. Invoke function locally
    --function / -f (required) ......... Name of the function
    --path / -p ........................ Path to JSON or YAML file holding input data
    --data / -d ........................ input data
    --raw .............................. Flag to pass input data as a raw string
    --context / -c ..................... Context of the service
    --contextPath / -x ................. Path to JSON or YAML file holding context data
```

### DynamoDB Shell

[http://localhost:8000/shell](http://localhost:8000/shell)

### API Gateway Entrypoint

[http://localhost:5000](http://localhost:5000)

## TODO

- Add CLI that installs Serverless framework and plugins for easier setup
- More test coverage

## License

MIT © [Hoishin (Keiichiro Amemiya)](https://github.com/Hoishin)
