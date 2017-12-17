const S3_SDK = require('aws-sdk/clients/s3')
const S3 = new S3_SDK()

const stringify = obj => {
  return JSON.stringify(obj, null, 2)
}

module.exports = class {
  constructor(
    source = 'db.json',
    {
      defaultValue = {},
      serialize = stringify,
      deserialize = JSON.parse,
      aws = {}
    } = {}
  ) {
    this.source = source
    this.defaultValue = defaultValue
    this.serialize = serialize
    this.deserialize = deserialize
    this.contentType = aws.contentType || 'application/json'
    this.bucketName = aws.bucketName || 'lowdb-private'
    this.acl = aws.acl || 'private'
  }

  read() {
    return new Promise((resolve, reject) => {
      S3.getObject({ Key: this.source, Bucket: this.bucketName })
        .promise()
        .then(data => {
          resolve(this.deserialize(data.Body))
        })
        .catch(err => {
          if (err.errorCode === 'NoSuchBucket') {
            S3.createBucket({ Bucket: this.bucketName })
              .promise()
              .then(data => {
                this.write(this.defaultValue)
                  .then(() => resolve(this.defaultValue))
                  .catch(reject)
              })
              .catch(reject)
          } else if (err.errorCode === 'NoSuchKey') {
            this.write(this.defaultValue)
              .then(() => resolve(this.defaultValue))
              .catch(reject)
          } else {
            reject(err)
          }
        })
    })
  }

  write(data) {
    return S3.putObject({
      Key: this.source,
      Body: this.serialize(data),
      ACL: this.acl,
      ContentType: this.contentType,
      Bucket: this.bucketName
    }).promise()
  }
}
