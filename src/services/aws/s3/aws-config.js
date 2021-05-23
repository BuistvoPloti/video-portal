const AWS = require('aws-sdk');
const {
  aws: {
    accessKeyId,
    secretAccessKey,
    region }
} = require('../../../config');

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

module.exports = {
  AWS,
};
