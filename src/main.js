const AWS = require('aws-sdk/global')
const S3_CLIENT = require('aws-sdk/clients/s3')
const stringify = obj => JSON.stringify(obj, null, 2)

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
    this.cognitoCredentials = aws.cognitoCredentials || false
    this.bucketName = aws.bucketName || 'lowdb-data'
    this.acl = aws.acl || 'private'

    let options = { apiVersion: '2006-03-01' }

    if (this.cognitoCredentials) {
      options.credentials = new AWS.CognitoIdentityCredentials(
        this.cognitoCredentials
      )
    }

    this.S3 = new S3_CLIENT(options)
  }

  read() {
    return new Promise((resolve, reject) => {
      this.S3.getObject({ Bucket: this.bucketName, Key: this.source })
        .promise()
        .then(data => {
          resolve(this.deserialize(data.Body))
        })
        .catch(err => {
          if (err.code === 'NoSuchKey') {
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
    return this.S3.putObject({
      Body: this.serialize(data),
      Bucket: this.bucketName,
      Key: this.source,
      ContentType: this.contentType,
      ACL: this.acl
    }).promise()
  }
}
