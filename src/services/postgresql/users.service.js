const pool = require('../../db/postgresql').connectionPool;
const {
  makeSalt,
  encryptPassword,
  authenticate,
  generateAccessToken,
} = require('../../utils/security');
const { throwCustomException } = require('../../utils/response-helpers');
const { buildQueryPartSequentialArguments } = require('../../utils/string-helpers');
const {
  application: { tokenSecret },
} = require("../../config");

const nameToUpperCase = name => {
  return name.toUpperCase();
}

const testing_pool = async () => {
  return pool.query('SELECT * FROM users')
}

const _getUserByProperty = async (property, columnName) => {
  if (columnName === 'password' || columnName === 'salt') return;

  const query = {
    name: `fetch-user-by-${columnName}`,
    text: `SELECT * FROM users WHERE ${columnName} = $1`,
    values: [property],
  }
  return pool.query(query);
}

const _checkUserExistsWithLoginOrUsername = async (usernameOrEmail) => {
  let candidateUser = await _getUserByProperty(usernameOrEmail, 'username');
  if (!candidateUser.rowCount) {
    candidateUser = await _getUserByProperty(usernameOrEmail, 'email');
    if (!candidateUser.rowCount) throwCustomException('User not found');
  }
  return candidateUser;
};

const checkUserExists = async (username, email) => {
  const query = {
    name: `fetch-user`,
    text: 'SELECT username, email FROM users ' +
          'WHERE username = $1 OR email = $2',
    values: [username, email],
  }
  return pool.query(query);
};

const signUp = async (username, email, role, password) => {
  const existingUser = await checkUserExists(username, email);
  if (existingUser.rowCount) {
    throwCustomException(`User with such credentials already exists`);
  }
  const salt = makeSalt();
  const hashed_password = encryptPassword(password, salt);
  const query = {
    name: 'sign-up',
    text: 'INSERT INTO users(username, email, role, password, salt) ' +
          'VALUES($1, $2, $3, $4, $5)  RETURNING username, email, role',
    values: [username, email, role, hashed_password, salt]
  }
  const user = await pool.query(query);
  return user.rows;
}

const signIn = async (usernameOrEmail, password) => {
  const candidateUser = await _checkUserExistsWithLoginOrUsername(usernameOrEmail);
  const user = candidateUser.rows[0];
  const authenticated = authenticate(password, user.password, user.salt);
  if (!authenticated) {
    throwCustomException('Wrong credentials')
  }
  const userPayload = {
    username: user.username,
    email: user.email,
    role: user.role,
  }
  return generateAccessToken(userPayload);
}

const getUsers = async () => {
  const query = {
    name: 'get-users',
    text: 'SELECT user_id, username, email, role FROM users',
  }
  const users = await pool.query(query);
  return users.rows;
}

const getUser = async (userId) => {
  const query = {
    text: 'SELECT user_id, username, email, role FROM users ' +
          'WHERE user_id = $1',
    values: [userId],
  }
  const user = await pool.query(query);
  return user.rows;
}

const createUser = async (username, email, role, password) => {
  return signUp(username, email, role, password);
}

const updateUser = async (userData, userId) => {
  const setArguments = buildQueryPartSequentialArguments(userData);
  const shapedData = Object.keys(userData);
  const dataLength = shapedData.length + 1;
  const shapedDataValues = shapedData.map((item) => {
    return userData[item];
  })
  const values = [...shapedDataValues, userId];
  const query = {
    text: 'UPDATE users ' +
          'SET ' + setArguments +
          ' WHERE user_id = $' + dataLength + ' RETURNING user_id, username, email, role',
    values,
  }
  const user = await pool.query(query);
  return user.rows;
}

const deleteUser = async (userId) => {
  const query = {
    text: 'DELETE FROM USERS ' +
      'WHERE user_id = $1 RETURNING user_id, username, email, role',
    values: [userId],
  }
  const user = await pool.query(query);
  return user.rows;
}

const getUserByUsername = async (username) => {
  const query = {
    text: 'SELECT user_id, username, email, role FROM users ' +
      'WHERE username = $1',
    values: [username],
  }
  const user = await pool.query(query);
  return user.rows;
}

module.exports = {
  nameToUpperCase,
  testing_pool,
  signUp,
  signIn,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername,
}
