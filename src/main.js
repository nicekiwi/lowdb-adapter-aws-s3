const AWS = require('aws-sdk');
const S3_CLIENT = AWS.S3;
const stringify = obj => JSON.stringify(obj, null, 2);
const deasync = require("deasync");

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
    
    var readData = this.defaultValue;
    var done = false;
    
    this.S3.getObject({
        Bucket: this.bucketName,
        Key: this.source
    }, (err, data) => {
        if(err){
            if(err.code == "NoSuchKey"){
                console.log("Error: Could not find ", this.source);
                this.write(this.defaultValue);
            }else console.log("Error: ", err);
        }else{
            //console.log("Read object: ", this.source, "\nData: ", data.Body);
            readData = this.deserialize(data.Body);
        }
        
        done=true;
    });
    
    deasync.loopWhile(function(){ return !done; });
    
    return readData;
    
  }

  write(data) {
    this.S3.putObject({
        Body: this.serialize(data),
        Bucket: this.bucketName,
        Key: this.source,
        ContentType: this.contentType,
        ACL: this.acl
    }, (err, dat) => {
        if(err) console.log("Error", err);
        //else console.log("Wrote to object: ", this.source, data);
    });
  }
}
