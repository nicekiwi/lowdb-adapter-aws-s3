'use strict';

class S3 {
    constructor() {
        this.key = null
        this.data = null
    }

    getObject(params, callback) {
        if(!params.Key) return callback('Key is missing.')
        if(!params.Bucket) return callback('Bucket is missing.')
        if(params.Key !== this.key) return callback({ statusCode: 404 });

        return callback(null, { Body: this.data });
    }

    putObject(params, callback) {
        if(!params.Key) return callback('Key is missing.')
        if(!params.Body) return callback('Body is missing.')
        if(!params.Bucket) return callback('Bucket is missing.')

        this.key = params.Key
        this.data = params.Body

        return callback(null);
    }
}

const AWS = jest.genMockFromModule('aws-sdk');

AWS.config = {
    update: obj => {}
};

AWS.S3 = S3;

module.exports = AWS;