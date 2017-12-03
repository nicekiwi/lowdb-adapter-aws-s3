const AWS = require('aws-sdk')

const stringify = obj => { 
    return JSON.stringify(obj, null, 2)
}

const writeObject = (aws, params) => {
    return new Promise((resolve, reject) => {
        aws.putObject(params, err => err ? reject(err): resolve())
    })
}

class AwsStorage {
    constructor(source, {  
        defaultValue = {}, 
        serialize = stringify, 
        deserialize = JSON.parse,
        aws = {}} = {}
    ) {
        this.source =       source
        this.defaultValue = defaultValue
        this.serialize =    serialize
        this.deserialize =  deserialize
        this.acl =          aws.acl || 'private'
        this.contentType =  aws.contentType || 'application/json'
        this.bucketName =   aws.bucketName || 'lowdb-private'

        AWS.config.update({
            accessKeyId: aws.accessKeyId  || null,
            secretAccessKey: aws.secretAccessKey || null
        })

        this.S3 = new AWS.S3()
    }

    read() {
        return new Promise((resolve, reject) => {

            this.S3.getObject({ 
                Key: this.source, 
                Bucket: this.bucketName 
            }, (err, data) => {

                // Catch 'NoSuchKey' error
                if((err && err.statusCode === 404) || (data && !data.Body)) {
                    writeObject(this.S3, { 
                        Key: this.source, 
                        Body: this.serialize(this.defaultValue), 
                        ACL: this.acl, 
                        ContentType: this.contentType, 
                        Bucket: this.bucketName 
                    }).then(() => {
                        resolve(this.defaultValue)
                    }).catch(err => reject)
                } 
                
                // return the data if found
                else if(data && data.Body) {
                    resolve(this.deserialize(data.Body))
                } 
                
                else if(err) {
                    reject(err)
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