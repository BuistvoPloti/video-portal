const jwt = require('jsonwebtoken');
const {
  UserIsNotAuthorizedException,
  JsonWebTokenDefaultException
} = require('../exceptions/exceptions');
const { usersService } = require('../services');
const { sendErrorResponse } = require('../utils/response-helpers');
const {
  application: { tokenSecret },
} = require('../config');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    const error = new UserIsNotAuthorizedException();
    const { code } = error;
    sendErrorResponse(res, error, code);
    return next(error);
  }

  try {
    const verificationResponse = jwt.verify(token, tokenSecret);
    if (!verificationResponse) {
      throw new JsonWebTokenDefaultException();
    }
    const { user_id } = verificationResponse;
    const user = await usersService.getUserWith2faCode(user_id);
    req.user = user;
  } catch (error) {
    const code = 400;
    sendErrorResponse(res, error, code);
    return next(error);
  }
  return next();
};

module.exports = {
  auth,
};
