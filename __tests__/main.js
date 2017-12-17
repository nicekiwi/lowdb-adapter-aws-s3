'use strict'

jest.mock('aws-sdk/clients/s3')

const sinon = require('sinon')
const S3Adapter = require('../src/main')
const obj = { a: 1 }

describe('AWS S3 Adapter', () => {
  test('should read from aws', () => {
    let db = new S3Adapter()
    db.read().then(data => expect(data).toEqual({}))
  })

  test('should write to aws', () => {
    let db = new S3Adapter()
    db
      .write(obj)
      .then(() => db.read())
      .then(data => expect(data).toEqual(obj))
      .catch(console.error)
  })

  test('should support options', () => {
    const serialize = sinon.spy(JSON.stringify)
    const deserialize = sinon.spy(JSON.parse)
    const db = new S3Adapter('db.json', {
      serialize,
      deserialize
    })

    db
      .write(obj)
      .then(() => db.read())
      .then(data => {
        expect(serialize.calledWith(obj)).toBeTruthy()
        expect(deserialize.called).toBeTruthy()
      })
  })
})
