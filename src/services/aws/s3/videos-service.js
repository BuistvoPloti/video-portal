const fs = require('fs');
const { logError } = require('../../../utils/logger');
const { AWS } = require('./aws-config');
const { aws: { videosBucketName } } = require('../../../config');

const s3 = new AWS.S3({ params: { Bucket: videosBucketName } });

const uploadVideo = async ({
  filePath,
  bucketKey,
  extension,
  size,
  author
}) => {
  try {
    const buffer = fs.readFileSync(filePath);

    const s3BucketData = {
      Key: bucketKey,
      Body: buffer,
      ACL: 'public-read-write',
      Metadata: { type: extension, user: author, size: size },
    };
    return await s3.putObject(s3BucketData).promise();
  } finally {
    await fs.unlink(filePath, e => e && logError(e));
  }
};

const deleteVideo = async (bucketKey) => {
  const s3BucketData = {
    Key: bucketKey,
  };
  return await s3.deleteObject(s3BucketData).promise();
};

module.exports = {
  uploadVideo,
  deleteVideo
};
