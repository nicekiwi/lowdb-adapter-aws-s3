const AWSMock = require('mock-aws-s3');

AWSMock.config.basePath = '/tmp/buckets/' // Can configure a basePath for your local buckets

let S3 = AWSMock.S3({ params: { Bucket: 'example' }});

s3.putObject({ Key: 'sea/animal.json', Body: '{"is dog":false,"name":"otter","stringified object?":true}'}, (err, data) => {
	s3.listObjects({Prefix: 'sea'}, (err, data) => {
		console.log(data);
	});
});