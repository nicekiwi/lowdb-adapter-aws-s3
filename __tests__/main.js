/* eslint-disable */
'use strict'

// require mocked aws-sdk
jest.mock('aws-sdk')

const obj = { a: 1 }
const sinon = require('sinon')
const AwsAdapter = require('../src/main')

describe('AWS Adapter', () => {
  const options = { aws: { accessKeyId: 'abc', secretAccessKey: '123' } }

  test('should read from db', () => {
    const storage = new AwsAdapter('db.json', options)
    storage.read().then(data => expect(data).toEqual({}))
  })

  test('should write to db', () => {
    const storage = new AwsAdapter('db.json', options)

    storage
      .write(obj)
      .then(() => storage.read())
      .then(data => expect(data).toEqual(obj))
      .catch(console.error)
  })

  it('should support options', () => {
    const serialize = sinon.spy(JSON.stringify)
    const deserialize = sinon.spy(JSON.parse)
    const storage = new AwsAdapter('db.json', {
      serialize,
      deserialize,
      aws: options.aws
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
