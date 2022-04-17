require('dotenv').config()

const fs = require('fs');

const awss3 = require('aws-sdk/clients/s3');

const bucketname = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const s3key = process.env.AWS_ACCESS_KEY_ID
const s3pass = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new awss3({
    region, s3key, s3pass
})


// a function to upload file to s3

const uploadFile = async (file) => {
    console.log(file)
    const fileStream = fs.createReadStream(file.path);
    const uploadDate = Date();

    const uploadParams = {
        Bucket: bucketname,
        Body: fileStream,
        Key: file.filename
    }

    const resultfromawss3 = await s3.upload(uploadParams).promise()
    console.log(resultfromawss3);
}

exports.uploadFile = uploadFile

// another functionn to get the files from s3

const getFile = async (filename) => {

    const getParams = {
        Key: filename,
        Bucket: bucketname,
    }

    return s3.getObject(getParams).createReadStream();
}

exports.getFile = getFile;

