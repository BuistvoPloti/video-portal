const request = require('request');
const s3VideosService = require('../../services/aws/s3/videos.service');
const videosService = require('../../services/postgresql/videos.service');
const usersService = require('../../services/postgresql/users.service');
const { errorLogger } = require("../../utils/logger-wrappers");
const { formatUrl } = require('../../utils/string-helpers');
const { bytesToSize } = require('../../utils/common');
const {
  handleSuccessResponse,
  handleErrorResponse,
  throwCustomException
} = require('../../utils/response-helpers');
const { aws: { videosBucketUrl } } = require('../../config');

const uploadVideo = async (req, res, next) => {
 try {
   // const user = { username: 'test' }; // for testing without auth middleware
   const user = req.user;
   const existingUser = await usersService.getUserByUsername(user.username);
   const userId = existingUser[0].user_id;
   const video = req.files.video;
   const callbackURL = formatUrl(req.query.callbackURL);

   const videoMetaData = {
     size: bytesToSize(req.files.video.size),
     filePath: video.path,
     fileFullName: video.name,
     nameAndExtension: video.name.split("."),
     fileName: video.name.split(".")[0],
     extension: video.name.split(".")[1],
     bucketKey: `${user.username}/${video.name}`,
     author: user.username,
   }
   const sourceFileLink = `${videosBucketUrl}/${videoMetaData.bucketKey}`;

   const uploadedVideo = await s3VideosService.uploadVideo(videoMetaData);
   const createdVideo = await videosService.createVideo(userId, videoMetaData.bucketKey);

   const responseData = {
     url: sourceFileLink,
     name: videoMetaData.fileName,
     extension: videoMetaData.extension,
     full_name: videoMetaData.fileFullName,
     size: videoMetaData.size,
     author: user.username
   }

   request.post(
     callbackURL,
     { json: { data: responseData } },
     (err) => {
       if (err) throwCustomException(`Error while requesting callback url: ${err}`);
     }
   );

   return handleSuccessResponse({ video: responseData }, res)
 } catch (e) {
   errorLogger(e);
   handleErrorResponse(res, e);
 }
}

module.exports = {
  uploadVideo,
}
