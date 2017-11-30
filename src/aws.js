const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_S3_API_KEY || null,
    secretAccessKey: process.env.AWS_S3_API_SECRET || null
})

module.exports = AWS;