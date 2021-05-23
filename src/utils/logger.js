const pino = require('pino');

const logger = pino({
  prettyPrint: {
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
  }
});

const log = (body) => {
  logger.info(body);
};

const logChild = body => logger.child(body);

const logError = body => logger.error(body);

const logWarn = body => logger.warn(body);

const logFatal = body => pino.fatal(body);

// other loggers wrappers.

module.exports = {
  log,
  logChild,
  logError,
  logWarn,
  logFatal
};
