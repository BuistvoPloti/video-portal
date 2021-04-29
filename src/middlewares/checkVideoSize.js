const { errorLogger } = require("../utils/logger-wrappers");
const { handleErrorResponse } = require('../utils/response-helpers');
const {
  aws: { videoSizeLimit },
} = require("../config");

const checkVideoSize = (req, res, next) => {
  const video = req.files.video;
  if (video.size > videoSizeLimit) {
    const error = {
      message: 'Video size is more than 5 GB',
    }
    const code = 409;
    errorLogger(error);
    return handleErrorResponse(res, error, code);
  }

  return next();
};

module.exports = {
  checkVideoSize,
};
