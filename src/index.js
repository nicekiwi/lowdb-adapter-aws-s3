const AWS = require('aws-sdk')

const stringify = obj => { 
    return JSON.stringify(obj, null, 2)
}

const writeObject = (aws, params) => {
    return new Promise(async (resolve, reject) => {
        aws.putObject(params, err => err ? reject(err): resolve())
    })
}

class AwsStorage {
    constructor(source, {  
        defaultValue = {}, 
        serialize = stringify, 
        deserialize = JSON.parse,
        aws = {}
    } = {}) {
        this.source =       source
        this.defaultValue = defaultValue
        this.serialize =    serialize
        this.deserialize =  deserialize
        this.acl =          aws.acl || 'private'
        this.contentType =  aws.contentType || 'application/json'
        this.bucketName =   aws.bucketName || 'lowdb-private'

        AWS.config.update({
            accessKeyId: aws.accessKeyId || process.AWS_ACCESS_KEY_ID || null,
            secretAccessKey: aws.secretAccessKey || process.AWS_SECRET_ACCESS_KEY || null
        })

        this.S3 = new AWS.S3()
    }

    read() {
        return new Promise((resolve, reject) => {

            this.S3.getObject({ 
                Key: this.source, 
                Bucket: this.bucketName 
            }, (err, data) => {

                if(err) {
                    reject(err)
                } else if(data && data.Body) {
                    resolve(this.deserialize(data.Body))
                } else {
                    writeObject(this.S3, { 
                        Key: this.source, 
                        Body: this.serialize(this.defaultValue), 
                        ACL: this.acl, 
                        ContentType: this.contentType, 
                        Bucket: this.bucketName 
                    }).then(() => {
                        resolve(this.defaultValue)
                    }).catch(err => reject())
                }
            })
        })
    }

    write(data) {
        return writeObject(this.S3, { 
            Key: this.source, 
            Body: this.serialize(data), 
            ACL: this.acl, 
            ContentType: this.contentType, 
            Bucket: this.bucketName 
        })
    }
}

module.exports = AwsStorage