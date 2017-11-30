const AWS = require('./aws')
const S3 = new AWS.S3()

const stringify = obj => { 
    return JSON.stringify(obj, null, 2)
}

const writeObject = params => {
    // TODO better error handling
    return new Promise(async (resolve, reject) => {
        S3.putObject(params, err => err ? reject(err): resolve())
    })
}

class AwsStorage {

    constructor(source, { 
        defaultValue = {}, serialize = stringify, deserialize = JSON.parse, aws = {}
    } = {}) {
        this.source =       source
        this.defaultValue = defaultValue
        this.serialize =    serialize
        this.deserialize =  deserialize
        this.acl =          aws.acl || 'private'
        this.contentType =  aws.contentType || 'application/json'
        this.bucketName =   aws.bucketName || 'lowdb-private'
    }

    read() {
        return new Promise((resolve, reject) => {

            S3.getObject({ 
                Key: this.source, 
                Bucket: this.bucketName 
            }, (err, data) => {

                // TODO better error handling

                if(data && data.Body) {
                    resolve(this.deserialize(data.Body))
                } else {

                    writeObject({ 
                        Key: this.source, 
                        Body: this.serialize(this.defaultValue), 
                        ACL: this.acl, 
                        ContentType: this.contentType, 
                        Bucket: this.bucketName 
                    })

                    resolve(this.defaultValue)
                }
            })
        })
    }

    write(data) {
        return writeObject({ 
            Key: this.source, 
            Body: this.serialize(data), 
            ACL: this.acl, 
            ContentType: this.contentType, 
            Bucket: this.bucketName 
        })
    }
}

module.exports = AwsStorage