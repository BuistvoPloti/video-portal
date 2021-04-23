const pool = require('../../db/postgresql').connectionPool;
const { makeSalt, encryptPassword } = require('../../utils/security');

const nameToUpperCase = name => {
  return name.toUpperCase();
}

const testing_pool = async () => {
  return pool.query('SELECT * FROM users')
}

const signUp = async (username, email, role, password) => {
  const salt = makeSalt();
  const hashed_password = encryptPassword(password, salt);
  const queryText = 'INSERT INTO users(username, email, role, password, salt) ' +
                    'VALUES($1, $2, $3, $4, $5)  RETURNING username, email, role';
  const values = [username, email, role, hashed_password, salt];
  const user = await pool.query(queryText, values);
  return user.rows;
}

module.exports = {
  nameToUpperCase,
  testing_pool,
  signUp
}
