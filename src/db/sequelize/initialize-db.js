const sequelize = require('.');
const { log, logError } = require('../../utils/logger');
const { db: { currentDbProviderName } } = require('../../config');

const assertDatabaseConnectionOk = async () => {
  try {
    if (currentDbProviderName === 'sequelize_postgres') {
      await sequelize.authenticate();
      await sequelize.sync({ force: false, alter: true });
      log('Sequelize connection OK');
    }
  } catch (error) {
    logError('Unable to connect to the database:');
    logError(error.message);
  }
};

const initSequelize = async () => {
  await assertDatabaseConnectionOk();
};

module.exports = initSequelize;
