const { Pool } = require('pg');
const { db: { databaseURL } } = require('../../config');

const connectionPool = (() => {
  let isDbConnected = false;
  let pool = {};
  return () => {
    if (isDbConnected) {
      return pool;
    }

    pool = new Pool({
      connectionString: databaseURL
    });
    isDbConnected = true;
    return pool;
  }
})();

module.exports = { connectionPool: connectionPool() };
