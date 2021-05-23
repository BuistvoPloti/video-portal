const pool = require('../../db/pg');
const {
  makeSalt,
  encryptPassword,
  authenticate,
  generateAccessToken,
} = require('../../utils/security');
const {
  UserNotFoundException,
  UserAlreadyExistsException,
  WrongUserCredentialsException
} = require('../../exceptions/exceptions');
const { buildQueryPartSequentialArguments } = require('../../utils/string-helpers');
const { getFirstItemFromPgQuery } = require('../../utils/lodash-wrappers');

const _checkUserExistsWithLoginOrUsername = async (usernameOrEmail) => {
  const query = {
    text: 'SELECT * FROM users '
      + 'WHERE username = $1 OR email = $1',
    values: [usernameOrEmail],
  };
  const user = await pool.query(query);
  if (!user.rowCount) throw new UserNotFoundException();
  return user;
};

const _getUserByProperty = async (property, columnName) => {
  if (columnName === 'password' || columnName === 'salt') return;

  const query = {
    name: `fetch-user-by-${columnName}`,
    text: `SELECT * FROM users WHERE ${columnName} = $1`,
    values: [property],
  };
  return pool.query(query);
};

const checkUserExists = async (username, email) => {
  const query = {
    name: 'fetch-user',
    text: 'SELECT username, email FROM users '
      + 'WHERE username = $1 OR email = $2',
    values: [username, email],
  };
  return pool.query(query);
};

const signUp = async (username, email, role, password, verified) => {
  const existingUser = await checkUserExists(username, email);
  if (existingUser.rowCount) {
    throw new UserAlreadyExistsException();
  }
  const salt = makeSalt();
  const hashed_password = encryptPassword(password, salt);
  const query = {
    name: 'sign-up',
    text: 'INSERT INTO users(username, email, role, password, salt, verified) '
      + 'VALUES($1, $2, $3, $4, $5, $6)  RETURNING user_id, username, email, role, verified',
    values: [username, email, role, hashed_password, salt, verified]
  };
  const user = await pool.query(query);
  return getFirstItemFromPgQuery(user);
};

const createPendingUser = async (userId, confirmationCode) => {
  const query = {
    text: 'INSERT INTO pending_users(user_id, confirmation_code) '
      + 'VALUES($1, $2)  RETURNING user_id, confirmation_code',
    values: [userId, confirmationCode]
  };
  const pendingUser = await pool.query(query);
  return getFirstItemFromPgQuery(pendingUser);
};

const findPendingUserByConfirmCode = async (confirmationCode) => {
  const query = {
    text: 'SELECT * from pending_users '
      + 'WHERE confirmation_code = $1',
    values: [confirmationCode]
  };
  const pendingUser = await pool.query(query);
  return getFirstItemFromPgQuery(pendingUser);
};

const setVerifiedUser = async (userId) => {
  const query = {
    text: 'UPDATE users '
      + 'SET verified = $1 '
      + 'WHERE user_id = $2 RETURNING user_id, username, email, role, verified',
    values: [true, userId]
  };
  const user = await pool.query(query);
  return getFirstItemFromPgQuery(user);
};

const deleteVerifiedPendingUser = async (pendingUserId) => {
  const query = {
    text: 'DELETE FROM pending_users '
      + 'WHERE pending_user_id = $1 RETURNING pending_user_id, user_id',
    values: [pendingUserId],
  };
  return pool.query(query);
};

const signIn = async (usernameOrEmail, password) => {
  const candidateUser = await _checkUserExistsWithLoginOrUsername(usernameOrEmail);
  const user = getFirstItemFromPgQuery(candidateUser);
  const authenticated = authenticate(password, user.password, user.salt);
  if (!authenticated) throw new WrongUserCredentialsException();
  const userPayload = {
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return generateAccessToken(userPayload);
};

const getUsers = async () => {
  const query = {
    name: 'get-users',
    text: 'SELECT user_id, username, email, role FROM users',
  };
  const users = await pool.query(query);
  return users.rows;
};

const getUser = async (userId) => {
  const query = {
    text: 'SELECT user_id, username, email, role FROM users '
      + 'WHERE user_id = $1',
    values: [userId],
  };
  const user = await pool.query(query);
  return user.rows;
};

const createUser = async (username, email, role, password, verified) => {
  return signUp(username, email, role, password, verified);
};

const updateUser = async (userData, userId) => {
  const setArguments = buildQueryPartSequentialArguments(userData);
  const shapedData = Object.keys(userData);
  const dataLength = shapedData.length + 1;
  const shapedDataValues = shapedData.map(item => userData[item]);
  const values = [...shapedDataValues, userId];
  const query = {
    text: `${'UPDATE users '
    + 'SET '}${setArguments
    } WHERE user_id = $${dataLength} RETURNING user_id, username, email, role`,
    values,
  };
  const user = await pool.query(query);
  return user.rows;
};

const deleteUser = async (userId) => {
  const query = {
    text: 'DELETE FROM USERS '
      + 'WHERE user_id = $1 RETURNING user_id, username, email, role',
    values: [userId],
  };
  const user = await pool.query(query);
  return user.rows;
};

const getUserByUsername = async (username) => {
  const query = {
    text: 'SELECT user_id, username, email, role FROM users '
      + 'WHERE username = $1',
    values: [username],
  };
  const user = await pool.query(query);
  return getFirstItemFromPgQuery(user);
};

const getVerifiedFromUser = async (emailOrUsername) => {
  const query = {
    text: 'SELECT verified FROM users WHERE email = $1 OR username = $1',
    values: [emailOrUsername],
  };
  const userData = await pool.query(query);
  return getFirstItemFromPgQuery(userData);
};

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByUsername,
  createPendingUser,
  findPendingUserByConfirmCode,
  deleteVerifiedPendingUser,
  setVerifiedUser,
  getVerifiedFromUser
};
