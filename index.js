const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_S3_API_KEY,
    secretAccessKey: process.env.AWS_S3_API_SECRET
});

const S3 = new AWS.S3();

let stringify = obj => JSON.stringify(obj, null, 2);
let writeObject = params => {
    // TODO better error handling
    return new Promise(async (resolve, reject) => {
        S3.putObject(params, err => err ? reject(err): resolve());
    });
};

class AwsS3Storage {

    constructor(source, { defaultValue = {}, serialize = stringify, deserialize = JSON.parse, acl = 'public-read', contentType = 'application/json', bucketName = 'lowdb-public' } = {}) {
        this.source = source
        this.defaultValue = defaultValue
        this.serialize = serialize
        this.deserialize = deserialize
        this.acl = acl
        this.contentType = contentType
        this.bucketName = bucketName
    }

    read() {
        return new Promise((resolve, reject) => {

            S3.getObject({ 
                Key: this.source, 
                Bucket: this.bucketName 
            }, (err, data) => {

                // TODO better error handling

                if(data && data.Body) {
                    resolve(this.deserialize(data.Body));
                } else {

                    writeObject({ 
                        Key: this.source, 
                        Body: this.serialize(this.defaultValue), 
                        ACL: this.acl, 
                        ContentType: this.contentType, 
                        Bucket: this.bucketName 
                    });

                    resolve(this.defaultValue);
                }
            });
        });
    }

    write(data) {
        return writeObject({ 
            Key: this.source, 
            Body: this.serialize(data), 
            ACL: this.acl, 
            ContentType: this.contentType, 
            Bucket: this.bucketName 
        });
    }
}

module.exports = AwsS3Storage;