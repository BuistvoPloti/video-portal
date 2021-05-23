const migrations = require('auto-load')('src/db-migrations');
const { log, logError } = require('../../utils/logger');
const { connectionPool } = require('.');

log('Running migrations...');

const runMigrations = async (pool) => {
  let done = true;
  try {
    // eslint-disable-next-line
    for (const migration in migrations) {
      // eslint-disable-next-line no-await-in-loop
      await migrations[migration](pool);
    }
  } catch (e) {
    done = false;
    logError(`Error while running migrations: ${e}`);
  } finally {
    if (done) {
      log('Migrations are finished');
    }
  }
};

runMigrations(connectionPool).then();

module.exports = {
  runMigrations,
};
