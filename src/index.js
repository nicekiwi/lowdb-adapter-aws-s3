const AWS = require('aws-sdk')

const stringify = obj => { 
    return JSON.stringify(obj, null, 2)
}

class AwsStorage {
    constructor(source, { 
        defaultValue, serialize, deserialize, aws = {}} = {}) {
        this.source =       source || 'db.json'
        this.defaultValue = defaultValue || {}
        this.serialize =    serialize || stringify
        this.deserialize =  deserialize || JSON.parse
        this.acl =          aws.acl || 'private'
        this.contentType =  aws.contentType || 'application/json'
        this.bucketName =   aws.bucketName || 'lowdb-private'
        this.region =       aws.region
        
        if(!aws.accessKeyId) console.error('AWS Access Key ID Required')
        if(!aws.secretAccessKey) console.error('AWS Secret Access Key Required')

        AWS.config.update({
            logger: console,
            accessKeyId: aws.accessKeyId  || null,
            secretAccessKey: aws.secretAccessKey || null,
            region: aws.region || null
        })

        this.S3 = new AWS.S3()
    }

    read() {
        return new Promise((resolve, reject) => {

            this.S3.getObject({ 
                Key: this.source, 
                Bucket: this.bucketName 
            }).promise().then(data => {
                resolve(this.deserialize(data.Body))
            }).catch(err => {
                if (err.errorCode === 'NoSuchBucket') {
                    this.S3.createBucket({
                        Bucket: this.bucketName
                    }).promise().then(data => {
                        this.write(this.defaultValue).then(resolve(this.defaultValue)).catch(reject)
                    }).catch(reject)
                } else if (err.errorCode === 'NoSuchKey') {
                    this.write(this.defaultValue).then(resolve(this.defaultValue)).catch(reject)
                } else {
                    reject(err)
                }
            })
        })
    }

    write(data) {
        return this.S3.putObject({ 
            Key: this.source, 
            Body: this.serialize(data), 
            ACL: this.acl, 
            ContentType: this.contentType, 
            Bucket: this.bucketName 
        }).promise();
    }
}

module.exports = AwsStorage