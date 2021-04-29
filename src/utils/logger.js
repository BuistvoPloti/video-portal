const pino = require('pino');

const logger = pino({
  prettyPrint: {
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss",
    ignore: "pid,hostname",
  }
});

const log = (body) => {
  logger.info(body)
};

const logChild = (body) => {
  return logger.child(body)
};

const logError = (body) => {
  return logger.error(body)
};

const logWarn = (body) => {
  return logger.warn(body)
};

const logFatal = (body) => {
  return pino.fatal(body)
};

//other loggers wrappers.

module.exports = {
  log,
  logChild,
  logError,
  logWarn,
  logFatal
};
