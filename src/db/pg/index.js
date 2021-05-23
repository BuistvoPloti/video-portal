const { Pool } = require('pg');
const { db: { databaseURL } } = require('../../config');

const pool = new Pool({
  connectionString: databaseURL
});

module.exports = pool;
