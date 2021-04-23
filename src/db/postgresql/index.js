const { Pool } = require('pg');
const DATABASE_URL = 'postgres://postgres:denis126478712@127.0.0.1:5432/VideoPlatform';

const connectionPool = (() => {
  let isDbConnected = false;
  let pool = {};
  return () => {
    if (isDbConnected) {
      return pool;
    }

    pool = new Pool({
      connectionString: DATABASE_URL
    });
    isDbConnected = true;
    return pool;
  }
})();

module.exports = { connectionPool: connectionPool() };
