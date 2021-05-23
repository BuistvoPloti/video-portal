require('dotenv').config();

const stage = process.env.STAGE || 'dev';

const config = {
  application: {
    name: 'video-service',
    apiVersion: '1.0.0',
    port: process.env.SERVER_PORT || '8081',
    tokenSecret: process.env.TOKEN_SECRET || 'aa9d0b4d87d6a5f16d11997f59350d82646a067fee9a2b58564dcf2d1e3b2e2c21fbabc8140b2277527fdef18c2ddd201914e653faa515158094c6f96f839300',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7', // in days
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    videosBucketUrl: process.env.AWS_VIDEOS_BUCKET_URL,
    videosBucketName: process.env.AWS_VIDEOS_BUCKET_NAME,
    videoSizeLimit: parseInt(process.env.VIDEO_MAX_SIZE, 10),
  },
  db: {
    databaseURL: stage === 'dev'
      ? (process.env.DEV_DB_URL || 'postgres://postgres:postgres@postgres:5432/postgres')
      : (process.env.LOCAL_DB_URL || 'postgres://postgres:password@127.0.0.1:5432/postgres'),
    dbProviderNames: {
      pgPostgres: process.env.DATABASE_PG_POSTGRES,
      prismaPostgres: process.env.DATABASE_PRISMA_POSTGRES,
      sequelizePostgres: process.env.DATABASE_SEQUELIZE_POSTGRES || 'sequelize_postgres',
    },
    currentDbProviderName: process.env.DATABASE_SEQUELIZE_POSTGRES || 'sequelize_postgres', // DATABASE_NAME_X
  },
  mailer: {
    host: process.env.MAILER_HOST,
    email: process.env.MAILER_EMAIL,
    password: process.env.MAILER_PASSWORD_CODE,
    port: process.env.MAILER_PORT,
    service: process.env.MAILER_SERVICE,
    baseVerifyUrl: process.env.STAGE === 'dev' // specify port
      ? 'http://127.0.0.3:8081/users/verify'
      : 'http://localhost:8081/users/verify',
  }
};

module.exports = config;
