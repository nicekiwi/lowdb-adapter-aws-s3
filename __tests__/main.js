'use strict'

jest.mock('aws-sdk/clients/s3')

const sinon = require('sinon')
const S3Adapter = require('../src/main')
const obj = { a: 1 }

describe('AWS Adapter', () => {
  test('should read from db', () => {
    let storage = new S3Adapter()
    storage.read().then(data => expect(data).toEqual({}))
  })

  test('should write to db', () => {
    let storage = new S3Adapter()
    storage
      .write(obj)
      .then(() => storage.read())
      .then(data => expect(data).toEqual(obj))
      .catch(console.error)
  })

  test('should support options', () => {
    const serialize = sinon.spy(JSON.stringify)
    const deserialize = sinon.spy(JSON.parse)
    const storage = new S3Adapter('db.json', {
      serialize,
      deserialize
    })

    storage
      .write(obj)
      .then(() => storage.read())
      .then(data => {
        expect(serialize.calledWith(obj)).toBeTruthy()
        expect(deserialize.called).toBeTruthy()
      })
  })
})
