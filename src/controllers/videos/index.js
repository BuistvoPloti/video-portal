const { videosService } = require('../../services');
const { usersService } = require('../../services');
const s3SequelizeService = require('../../services/mutual-usage-services.js/s3-sequelize-videos-service');
const { postBackVideoData } = require('../../utils/axios-requests');
const {
  TransactionNotPassedException
} = require('../../exceptions/exceptions');
const {
  createVideoMetadataObject,
  addSourceToVideosList
} = require('../../utils/common');
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require('../../utils/response-helpers');
const { aws: { videosBucketUrl } } = require('../../config');

const uploadVideo = async (req, res, next) => {
  try {
    const { user } = req;
    const existingUser = await usersService.getUserByUsername(user.username);
    const userId = existingUser.user_id;
    const { video } = req.files;
    const { callbackURL } = req.query;
    const videoMetaData = createVideoMetadataObject(video, user);
    const { bucketKey } = videoMetaData;
    const sourceFileLink = `${videosBucketUrl}/${videoMetaData.bucketKey}`;

    const transactionStatus = await s3SequelizeService.uploadAndCreateVideoSafe(userId, bucketKey, videoMetaData);
    if (!transactionStatus) throw new TransactionNotPassedException('Upload video error');

    const responseData = {
      url: sourceFileLink,
      name: videoMetaData.fileName,
      extension: videoMetaData.extension,
      full_name: videoMetaData.fileFullName,
      size: videoMetaData.size,
      author: user.username
    };

    await postBackVideoData(callbackURL, responseData);

    return sendSuccessResponse({ video: responseData }, res);
  } catch (e) {
    const code = 400 || e.code instanceof String;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

const getVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const video = await videosService.getVideo(videoId);
    const videoWithSourceLink = addSourceToVideosList([video]);
    return sendSuccessResponse({ video: videoWithSourceLink }, res);
  } catch (e) {
    sendErrorResponse(res, e);
    return next(e);
  }
};

const getVideos = async (req, res, next) => {
  try {
    const videos = await videosService.getVideos();
    const videosWithSourceLink = addSourceToVideosList(videos);
    return sendSuccessResponse({ videos: videosWithSourceLink }, res);
  } catch (e) {
    sendErrorResponse(res, e);
    return next(e);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const transactionStatus = await s3SequelizeService.deleteVideoSafe(videoId);
    if (!transactionStatus) throw new TransactionNotPassedException('Delete video error');
    return sendSuccessResponse({}, res, 204);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

module.exports = {
  uploadVideo,
  getVideo,
  getVideos,
  deleteVideo
};
