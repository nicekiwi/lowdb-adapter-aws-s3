'use strict';

class S3 {
    constructor() {
        this.bucket = null
        this.key = null
        this.data = null
    }

    getObject(params) {
        return new Promise((resolve, reject) => {
            if(!params.Key) reject('Key is missing.')
            else if(!params.Bucket) reject('Bucket is missing.')
            else if(params.Key !== this.key) return callback({ errorCode: 'NoSuchKey' })
            else resolve({ Body: this.data })
        })
    }

    putObject(params, callback) {
        return new Promise((resolve, reject) => {
            if(!params.Key) reject('Key is missing.')
            else if(!params.Body) reject('Body is missing.')
            else if(!params.Bucket) reject('Bucket is missing.')
            else {
                this.key = params.Key
                this.data = params.Body

                resolve()
            }
        })
    }
}

const AWS = jest.genMockFromModule('aws-sdk');

AWS.config = {
    update: obj => {}
};

AWS.S3 = S3;

module.exports = AWS;