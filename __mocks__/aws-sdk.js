/* eslint-disable */
'use strict'

module.exports = class S3 {
  constructor(options) {
    this.options = options
    this.result = null
    this.bucket = null
    this.key = {
      path: null,
      data: null
    }
  }

  promise() {
    return new Promise((resolve, reject) => resolve(this.result))
  }

  getObject(params) {
    if (params.Key !== this.key.path) this.result = { code: 'NoSuchKey' }
    else this.result = { Body: this.key.data }
    return this
  }

  putObject(params) {
    this.key.path = params.Key
    this.key.data = params.Body
    return this
  }
}