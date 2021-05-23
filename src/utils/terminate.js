const { logError } = require('./logger');
const currentConnection = require('../db/shut-down-db-connection');
const sequelize = require('../db/sequelize');

const terminate = (server, options = { coredump: false, timeout: 500 }) => {
  const exit = (code) => {
    options.coredump ? process.abort() : process.exit(code);
  };

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      logError(reason);
      logError(err.message);
      logError(err.stack);
      currentConnection.close(sequelize);
    }
    server.close(exit);
    setTimeout(exit, options.timeout).unref();
  };
};

module.exports = terminate;
