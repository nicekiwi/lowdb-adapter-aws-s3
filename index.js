const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const stringify = obj => JSON.stringify(obj, null, 2);

// Set the region
AWS.config.region = process.env.AWS_S3_REGION || 'ap-southeast-2';

const AWS_PARAMS = {
    Bucket: process.env.AWS_S3_SITE_BUCKET || 'lowdb-public',
    ACL: process.env.AWS_S3_REGION || 'public-read',
    ContentType: 'application/json'
};

let writeObject = params => {
    return new Promise((resolve, reject) => {
        S3.putObject(params, (err, data) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

class AwsS3Storage {

    constructor(source, { defaultValue = {}, serialize = stringify, deserialize = JSON.parse } = {}) {
        this.source = source
        this.defaultValue = defaultValue
        this.serialize = serialize
        this.deserialize = deserialize
    }

    read() {

        let params = Object.assign({ 
            Key: this.source
        }, AWS_PARAMS);
        
        return new Promise((resolve, reject) => {
            S3.getObject(params, (err, data) => {
                if (err) reject(err);
                else resolve(this.deserialize(data));

                // todo, check if data actually exists etc..
            });
        });
    }

    write(data) {

        let params = Object.assign({ 
            Key: this.source, 
            Body: this.serialize(data) 
        }, AWS_PARAMS);

        return new Promise((resolve, reject) => {
            S3.putObject(params, (err, data) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = AwsS3Storage;