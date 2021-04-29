const jwt = require('jsonwebtoken');
const { errorLogger } = require("../utils/logger-wrappers");
const { handleErrorResponse } = require("../utils/response-helpers");
const {
  application: { tokenSecret },
} = require("../config");

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    const error = {
      message: 'User is not authorized'
    };
    const code = 403;
    errorLogger(error);
    return handleErrorResponse(res, error, code);
  }

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) {
      const error = {
        message: 'Token is not valid'
      };
      const code = 403;
      errorLogger(error);
      return handleErrorResponse(res, error, code);
    }

    req.user = user;
    return next();
  });
};

module.exports = {
  auth,
};
