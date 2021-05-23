const _ = require('lodash');
const { sendErrorResponse } = require('../utils/response-helpers');
const { usersService } = require('../services');
const {
  UserNotFoundException,
  UserEmailIsNotVerifiedException
} = require('../exceptions/exceptions');

const isUserVerified = async (req, res, next) => {
  const emailOrUsername = req.body.login || '';
  const user = await usersService.getVerifiedFromUser(emailOrUsername);
  const condition = user === null || (Array.isArray(user) && !user.length) || !user || _.isEmpty(user);
  if (condition) {
    const error = new UserNotFoundException();
    const { code } = error;
    sendErrorResponse(res, error, code);
    return next(error);
  }

  const isVerified = user.verified;
  if (!isVerified) {
    const error = new UserEmailIsNotVerifiedException();
    const { code } = error;
    sendErrorResponse(res, error, code);
    return next(error);
  }

  return next();
};

module.exports = {
  isUserVerified,
};
