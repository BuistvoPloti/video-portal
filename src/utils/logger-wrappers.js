const { logError } = require('./logger');

const errorLogger = (err) => {
  return logError(err.message || 'Unknown error occurred. Error message was not specified.');
};

module.exports = {
  errorLogger,
}
