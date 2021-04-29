const { errorLogger } = require("../utils/logger-wrappers");
const { handleErrorResponse } = require('../utils/response-helpers');

const hasRole = (req, res, next) => {
  const userRole = req.user.role;
  const adminRole = 'admin';
  if (userRole !== adminRole) {
    const error = {
      message: 'Access denied',
    }
    const code = 403;
    errorLogger(error);
    return handleErrorResponse(res, error, code);
  }
  return next();
}

module.exports = {
  hasRole,
}
