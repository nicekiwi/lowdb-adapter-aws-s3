/* eslint-disable */
'use strict'

class S3 {
  constructor() {
    this.bucket = null
    this.key = null
    this.data = null
    this.result = null
  }

  promise() {
    return this.result
  }

  createBucket(params) {
    this.result = new Promise((resolve, reject) => {
      this.bucket = params.Bucket
      resolve()
    })

    return this
  }

  getObject(params) {
    this.result = new Promise((resolve, reject) => {
      if (params.Key !== this.key) reject({ errorCode: 'NoSuchKey' })
      else if (!params.Bucket) reject({ errorCode: 'NoSuchBucket' })
      else resolve({ Body: this.data })
    })

    return this
  }

  putObject(params) {
    this.result = new Promise((resolve, reject) => {
      this.key = params.Key
      this.data = params.Body

      resolve()
    })

    return this
  }
}

const AWS = jest.genMockFromModule('aws-sdk')

AWS.config = {
  update: obj => {}
}

AWS.S3 = S3

module.exports = AWS
