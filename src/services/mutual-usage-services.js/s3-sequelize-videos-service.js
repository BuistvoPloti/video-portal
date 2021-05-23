const sequelize = require('../../db/sequelize');
const videosService = require('../sequelize/videos-service');
const s3VideosService = require('../aws/s3/videos-service');
const { logError } = require('../../utils/logger');

const deleteVideoSafe = async (videoId) => {
  const video = await videosService.getVideo(videoId);
  const bucketKey = video.bucket_file_path;
  const transactionSuccess = true;
  const t = await sequelize.transaction();
  try {
    await videosService.deleteVideo(videoId, t);
    await s3VideosService.deleteVideo(bucketKey);
    await t.commit();
    return Promise.resolve(transactionSuccess);
  } catch (error) {
    logError(error);
    await t.rollback();
    return Promise.resolve(!transactionSuccess);
  }
};

const uploadAndCreateVideoSafe = async (userId, bucketFilePath, videoMetaData) => {
  const transactionSuccess = true;
  const t = await sequelize.transaction();
  try {
    await videosService.createVideo(userId, bucketFilePath, t);
    await s3VideosService.uploadVideo(videoMetaData);
    await t.commit();
    return Promise.resolve(transactionSuccess);
  } catch (error) {
    logError(error);
    await t.rollback();
    return Promise.resolve(!transactionSuccess);
  }
};

module.exports = {
  deleteVideoSafe,
  uploadAndCreateVideoSafe
};
