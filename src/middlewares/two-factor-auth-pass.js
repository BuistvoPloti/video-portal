const jwt = require('jsonwebtoken');
const {
  UserIsNotAuthorizedException,
  TwoFactorAuthenticationNotPassedException
} = require('../exceptions/exceptions');
const { sendErrorResponse } = require('../utils/response-helpers');
const {
  application: { tokenSecret },
} = require('../config');

const isSecondFactorAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    const error = new UserIsNotAuthorizedException();
    const { code } = error;
    sendErrorResponse(res, error, code);
    return next(error);
  }

  try {
    const tokenData = jwt.verify(token, tokenSecret);
    if (!tokenData.twoFactorAuthPassed) {
      throw new TwoFactorAuthenticationNotPassedException();
    }
    req.user = tokenData;
  } catch (error) {
    const code = 400;
    sendErrorResponse(res, error, code);
    return next(error);
  }
  return next();
};

module.exports = {
  isSecondFactorAuthenticated,
};
