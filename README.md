# Amazon S3 Adapter for LowDB

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
// grab the deps
const low = require('lowdb');
const lowAWS = require('lowdb-adapter-aws-s3');
const database = 'db.json';

// init the adapter
const adapter = new lowAWS(database, { 
    bucketName: 'lowdb-test' 
});

// be awesome!
let beAwesome = async () => {

    const db = await low(adapter);

    // Set some defaults
    await db.defaults({ posts: [], user: {} }).write();

    // Add a post
    await db.get('posts').push({ id: 1, title: 'lowdb is awesome'}).write();

    console.log('Victory!');
};

beAwesome();
```

## Tests

TODO