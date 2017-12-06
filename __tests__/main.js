'use strict';

// require mocked aws-sdk
jest.mock('aws-sdk');

const obj = { a: 1 }
const sinon = require('sinon')
const AwsAdapter = require('../src/index')

describe('AWS Adapter', () => {

    const options = { aws: { accessKeyId: 'abc', secretAccessKey: '123' } }

    // test('should read from db', async () => {
    //     const storage = new AwsAdapter('db.json', options)
    //     expect(await storage.read()).toEqual({})
    // })

    // test('should write to db', async () => {
    //     const storage = new AwsAdapter('db.json', options)
    //     await storage.write(obj)
    //     expect(await storage.read()).toEqual(obj)
    // })
    
    it('should support options', async () => {
        const serialize = sinon.spy(JSON.stringify)
        const deserialize = sinon.spy(JSON.parse)
    
        const storage = new AwsAdapter('db.json', { serialize, deserialize, aws: options.aws })

        storage.write(obj)
            .then(() => {
                storage.read()
            })
            .then(() => {
                expect(serialize.calledWith(obj)).toBeTruthy()
                expect(deserialize.called).toBeTruthy()
            })
    })
})