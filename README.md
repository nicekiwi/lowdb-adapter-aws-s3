# LowDB Amazon S3 Adapter

Cause AWS is amazeballs.

### Not Production Ready.

## Installation

`npm i --save lowdb-adapter-aws-s3`

## Configuration

TODO - Basicly you setup the AWS env variables

```
AWS_S3_API_KEY = null
AWS_S3_API_SECRET = null
```

## Usage

```
// Grab the deps
const lowDB = require('lowdb');
const AwsAdapter = require('lowdb-adapter-aws-s3');

// Init the adapter
const adapter = new AwsAdapter('db.json');

// Go hard!
lowDB(adapter)

  // Defaults FTW
  .then(db => db.defaults({ posts: [], user: {} }).write())

  // Push something awesome
  .then(db => db.get('posts').push({ id: 1, title: 'lowdb is awesome'}).write())

  // Profit!
  .then(db => console.log('Victory!'))
```

## Tests

`npm test`

## TODO

* write tests
* Finish documention config options
* Support the same NodeJS version as lowdb.
* handle S3 errors better