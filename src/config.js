require("dotenv").config();

const env = process.env.NODE_ENV;
const dev = {
  application: {
    port: process.env.SERVER_PORT,
    tokenSecret: process.env.TOKEN_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN, // in days
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    videosBucketUrl: process.env.AWS_VIDEOS_BUCKET_URL,
    videosBucketName: process.env.AWS_VIDEOS_BUCKET_NAME,
    videoSizeLimit: parseInt(process.env.VIDEO_MAX_SIZE),
  },
  db: {
    databaseURL: process.env.STAGE === 'dev'
      ? process.env.DEV_DB_URL : process.env.LOCAL_DB_URL
  }
};

const config = {
  dev,
};

module.exports = config[env];
