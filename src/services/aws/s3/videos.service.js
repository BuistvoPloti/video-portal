const fs = require('fs');
const { log } = require("../../../utils/logger");
const AWS = require('./aws-config').AWS;
const { aws: { videosBucketName } } = require('../../../config');

const s3Bucket = new AWS.S3({ params: { Bucket: videosBucketName } });

const uploadVideo = async ({
  filePath,
  bucketKey,
  extension,
  size,
  author
}) => {
  const buffer = fs.readFileSync(filePath);
  fs.unlinkSync(filePath);

  const data = {
    Key: bucketKey,
    Body: buffer,
    ACL: 'public-read-write',
    Metadata: {'type': extension, 'user': author, 'size': size },
  }
  return s3Bucket.putObject(data, (err) => {
    if (err) {
      console.log(err)
    } else {
      log('File uploaded successfully');
    }
  });
};

module.exports = {
  uploadVideo,
}
