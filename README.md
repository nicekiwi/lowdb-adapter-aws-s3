# Amazon S3 Adapter for LowDB

Cause AWS is amazeballs.

## Installation

`npm i --save lowdb-adapter-aws-s3`

## Configuration

TODO - Basicly you setup the AWS env variables

`
AWS_S3_API_KEY = null
AWS_S3_API_SECRET = null
AWS_S3_SITE_BUCKET = null
AWS_S3_REGION = null
`

## Usage

`
const low = require('lowdb');
const AwsS3 = require('lowdb-adapter-aws-s3');

const adapter = new AwsS3('db.json')
const db = low(adapter)

// conquer the galaxy!
db.defaults({ posts: [], user: {} })
  .write()
`

## Tests

TODO