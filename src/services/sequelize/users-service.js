const { Op } = require('sequelize');
const { models } = require('../../db/sequelize');
const {
  UserAlreadyExistsException,
  WrongUserCredentialsException,
  UserNotFoundException,
} = require('../../exceptions/exceptions');
const {
  encryptPassword,
  makeSalt,
  authenticate,
  generateAccessToken,
  excludePasswordSalt
} = require('../../utils/security');

const _checkUserExists = async (username, email) => {
  return models.user.findOne({
    where: {
      [Op.or]: [{ email: email }, { username: username }]
    },
    raw: true,
  });
};

const signUp = async (username, email, role, password, verified) => {
  const existingUser = await _checkUserExists(username, email);
  if (existingUser) {
    throw new UserAlreadyExistsException();
  }
  const salt = makeSalt();
  const hashed_password = encryptPassword(password, salt);
  const data = {
    username,
    email,
    role,
    password: hashed_password,
    salt,
    verified
  };
  const userEntity = await models.user.create(data);
  const user = excludePasswordSalt(userEntity.get({ plain: true }));
  return user;
};

const createPendingUser = async (userId, confirmationCode) => {
  const data = {
    user_id: userId,
    confirmation_code: confirmationCode,
  };
  return models.pending_user.create(data)
    .then(resultEntity => resultEntity.get({ plain: true }));
};

const _checkUserExistsWithLoginOrUsername = async (emailOrUsername) => {
  const user = await models.user.scope('unsafe').findOne({
    where: {
      [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }]
    },
    raw: true,
    nest: true
  });
  if (!user) throw new UserNotFoundException();
  return user;
};

const signIn = async (emailOrUsername, password, twoFactorAuthPassed = false) => {
  const user = await _checkUserExistsWithLoginOrUsername(emailOrUsername);
  const authenticated = authenticate(password, user.password, user.salt);
  if (!authenticated) throw new WrongUserCredentialsException();
  const userPayload = {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
    twoFactorAuthPassed,
  };
  return generateAccessToken(userPayload);
};

const getVerifiedFromUser = async (emailOrUsername) => {
  return models.user.findOne({
    attributes: ['verified'],
    where: {
      [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }]
    },
    raw: true,
  });
};

const getUsers = async () => {
  return models.user.findAll();
};

const getUser = async (userId) => {
  return models.user.findOne({
    where: {
      user_id: userId
    },
    raw: true,
    nest: true,
  });
};

const getUserWith2faCode = async (userId) => {
  return models.user.scope('with2faCode').findOne({
    where: {
      user_id: userId
    },
    raw: true,
    nest: true,
  });
};

const createUser = async (username, email, role, password, verified) => {
  return signUp(username, email, role, password, verified);
};

const getUserByUsername = async (username) => {
  return models.user.findOne({
    where: {
      username
    }
  });
};

const deleteUser = async (userId) => {
  return models.user.destroy({
    where: {
      user_id: userId,
    }
  });
};

const updateUser = async (userData, userId) => {
  const userEntity = await models.user.update(userData, {
    where: {
      user_id: userId,
    },
    raw: true,
    returning: true,
  });
  const user = excludePasswordSalt(userEntity[1][0]);
  return user;
};

const findPendingUserByConfirmCode = async (confirmationCode) => {
  return models.pending_user.findOne({
    where: {
      confirmation_code: confirmationCode
    },
  });
};

const deleteVerifiedPendingUser = async (pendingUserId) => {
  return models.pending_user.destroy({
    where: {
      pending_user_id: pendingUserId
    },
  });
};

const setVerifiedUser = async (userId) => {
  const data = {
    verified: true
  };
  const userEntity = await models.user.update(data, {
    where: {
      user_id: userId
    },
    raw: true,
    returning: true,
  });
  const user = excludePasswordSalt(userEntity[1][0]);
  return user;
};

const setUserTwoFactorAuthCode = async (userId, base32code) => {
  const userData = {
    two_factor_authentication_code: base32code
  };
  const userEntity = await models.user.update(userData, {
    where: {
      user_id: userId,
    },
    raw: true,
    returning: true,
  });
  const user = excludePasswordSalt(userEntity[1][0]);
  return user;
};

module.exports = {
  signUp,
  createPendingUser,
  signIn,
  getVerifiedFromUser,
  getUsers,
  getUser,
  createUser,
  getUserByUsername,
  deleteUser,
  updateUser,
  findPendingUserByConfirmCode,
  deleteVerifiedPendingUser,
  setVerifiedUser,
  setUserTwoFactorAuthCode,
  getUserWith2faCode
};
