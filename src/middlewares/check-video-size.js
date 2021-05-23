const { VideoSizeIsTooLargeException } = require('../exceptions/exceptions');
const { sendErrorResponse } = require('../utils/response-helpers');
const {
  aws: { videoSizeLimit },
} = require('../config');

const checkVideoSize = (req, res, next) => {
  const { video } = req.files;
  if (video.size > videoSizeLimit) {
    const error = new VideoSizeIsTooLargeException();
    const { code } = error;
    sendErrorResponse(res, error, code);
    return next(error);
  }

  return next();
};

module.exports = {
  checkVideoSize,
};
