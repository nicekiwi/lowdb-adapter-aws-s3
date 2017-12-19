# AWS S3 Adapter for LowDB

[![Build Status](https://travis-ci.org/nicekiwi/lowdb-adapter-aws-s3.svg?branch=master)](https://travis-ci.org/nicekiwi/lowdb-adapter-aws-s3) [![npm version](https://badge.fury.io/js/lowdb-adapter-aws-s3.svg)](https://badge.fury.io/js/lowdb-adapter-aws-s3)

This adapter allows you to create and use a lowDB source located on AWS S3 Storage. 

Supports Node.JS >= 4.0.0, Electron and the Browser.

#### In active development, not Production ready.

## Why?

Cause AWS is amazeballs.. and I can't afford a MongoDB server. :P

## Installation

`npm i --save lowdb-adapter-aws-s3`

## Usage

```
// Grab the deps
const lowDB = require('lowdb')
const AwsAdapter = require('lowdb-adapter-aws-s3')

// Init the adapter
const adapter = new AwsAdapter()

// Go hard!
lowDB(adapter)

  // Defaults FTW
  .then(db => db.defaults({ posts: [], user: {} }).write())

  // Push something awesome
  .then(db => db.get('posts').push({ id: 1, title: 'lowdb is awesome'}).write())

  // Profit!
  .then(db => console.log('Victory!'))
```

## Configuration

`const adapter = new AwsAdapter('db.json', options)`

#### Constructor Options

The constructor uses the same options as lowDB itself, and can be passed `defaultValue`, `serialize` and `deserialize`.

However, this module introduces a new paramater: `aws` which contains the options to connect and write to AWS S3.

#### AWS Options

| Param | Type | Default | Description | 
| --- | --- | --- | --- |
| contentType | String | 'application/json' | The MimeType of the source file. |
| bucketName | String | 'lowdb-data' | The name of the S3 bucket to write to. |
| acl | String | 'private' | The AWS access control settings for the source file. |
| cognitoCredentials | null | Object | The Object containing `CognitoIdentityCredentials` options (only required when using in the browser or Electron). |

When using server-side AWS credentials should be set via the ENV, and will be picked up by AWS automattically. 

```
AWS_ACCESS_KEY_ID = null
AWS_SECRET_ACCESS_KEY = null
```

When using in the browser or Electron, you should (probably) be using an AWS [CognitoIdentityCredentials](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityCredentials.html#constructor-property) object, all you need to do is pass the options to the `cognitoCredentials` option in the `aws` options.

The `AWS.CognitoIdentityCredentials` object will be automatically created for you from the options you pass to the `cognitoCredentials` paramater. Easy peasy.

Example:

```
const adapter = new AwsAdapter('db.json', {
  aws: {
    cognitoCredentials: {
      IdentityPoolId: 'us-east-2:1699ebc0-7900-4099-b910-2df94f52a030,
      ...
    },
    ...
  }
})
```

## Tests

`npm test`

## Caveat

Obviously as read/write calls are made on-demand to AWS this is not a fast adapter, MongoDB would be a better choice for such Need for Speed. 

## Future

* Support bucket/file encryption
* Some kind of in-memory caching to speed up read times
