const server = require('./app');
const { application: { port } } = require('./config');
const { log, logError } = require('./utils/logger');
const initSequelize = require('./db/sequelize/initialize-db');
const terminate = require('./utils/terminate');

const exitHandler = terminate(server);

const runServer = () => {
  try {
    server.listen(port, () => {
      log(`Application ${server.name} is running on ${server.url}`);
    });
    initSequelize();
    server.once('error', (err) => {
      exitHandler(0, 'Server error')(err);
    });
  } catch (err) {
    exitHandler(0, 'Error while listening server')(err);
  }
};

runServer();

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));

server.on('NotFound', (req, res, err, cb) => cb());
server.on('restifyError', (req, res, err, cb) => {
  logError(err);
  return cb();
});
