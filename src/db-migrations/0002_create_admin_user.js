const { encryptPassword, makeSalt } = require('../utils/security');

const migration = async (db) => {
  const select_users = {
    text: 'SELECT user_id FROM users'
  };
  const users = await db.query(select_users);

  if (!users.rowCount) {
    const username = 'admin';
    const email = 'admin@gmail.com';
    const role = 'admin';
    const password = 'admin';
    const verified = true;
    const salt = makeSalt();
    const hashed_password = encryptPassword(password, salt);

    const query = {
      text: 'INSERT INTO users(username, email, role, password, salt, verified) '
            + 'VALUES($1, $2, $3, $4, $5, $6)',
      values: [username, email, role, hashed_password, salt, verified]
    };
    await db.query(query);
  }
};

module.exports = migration;
