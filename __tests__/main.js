'use strict';

// require mocked aws-sdk
jest.mock('aws-sdk');

const obj = { a: 1 }
const sinon = require('sinon')
const AwsAdapter = require('../src/index')

describe('AWS Adapter', () => {

    test('should read from db', async () => {
        const storage = new AwsAdapter('db.json')
        expect(await storage.read()).toEqual({})
    })

    test('should write to db', async () => {
        const storage = new AwsAdapter('db.json')
        await storage.write(obj)
        expect(await storage.read()).toEqual(obj)
    })
    
    it('should support options', async () => {
        const serialize = sinon.spy(JSON.stringify)
        const deserialize = sinon.spy(JSON.parse)
    
        const storage = new AwsAdapter('db.json', { serialize, deserialize })
    
        await storage.write(obj)
        await storage.read()
    
        expect(serialize.calledWith(obj)).toBeTruthy()
        expect(deserialize.called).toBeTruthy()
    })
})