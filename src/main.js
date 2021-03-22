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

  handleReadError(err, resolve, reject) {
    if (err.code === 'NoSuchKey') {
      return this.write(this.defaultValue)
        .then(() => resolve(this.defaultValue))
        .catch(reject)
    } else {
      return reject(err)
    }
  }

  read() {
    return new Promise((resolve, reject) => {
      const params = { Bucket: this.bucketName, Key: this.source }
      this.S3.getObject(params)
        .promise()
        .then(data => resolve(this.deserialize(data.Body)))
        .catch(err => this.handleReadError(err, resolve, reject))
    })
  }

  write(data) {
    const params = {
      Body: this.serialize(data),
      Bucket: this.bucketName,
      Key: this.source,
      ContentType: this.contentType,
      ACL: this.acl
    }

    return this.S3.putObject(params).promise()
  }
}
