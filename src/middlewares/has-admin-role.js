const { AccessDeniedException } = require('../exceptions/exceptions');
const { sendErrorResponse } = require('../utils/response-helpers');

const hasAdminRole = (req, res, next) => {
  const userRole = req.user.role;
  const adminRole = 'admin';

  if (userRole !== adminRole) {
    const error = new AccessDeniedException('Access denied');
    const { code } = error;
    sendErrorResponse(res, error, code);
    return next(error);
  }
  return next();
};

module.exports = {
  hasAdminRole,
};
