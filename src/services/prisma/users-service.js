const prisma = require('../../db/prisma');
const {
  generateAccessToken
} = require('../../utils/security');
const {
  makeSalt,
  encryptPassword,
  authenticate
} = require('../../utils/security');
const {
  UserAlreadyExistsException,
  UserNotFoundException,
  WrongUserCredentialsException,
} = require('../../exceptions/exceptions');

const _checkUserExists = async (username, email) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: username }]
    }
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
  return prisma.user.create({
    data,
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true
    },
  });
};

const createPendingUser = async (userId, confirmationCode) => {
  const data = {
    user_id: userId,
    confirmation_code: confirmationCode,
  };
  return prisma.pendingUser.create({ data });
};

const findPendingUserByConfirmCode = async (confirmationCode) => {
  return prisma.pendingUser.findFirst({
    where: {
      confirmation_code: confirmationCode
    },
  });
};

const deleteVerifiedPendingUser = async (pendingUserId) => {
  return prisma.pendingUser.delete({
    where: {
      pending_user_id: pendingUserId
    },
  });
};

const setVerifiedUser = async (userId) => {
  const data = {
    verified: true
  };
  return prisma.user.update({
    where: {
      user_id: userId
    },
    data,
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true
    },
  });
};

const _checkUserExistsWithLoginOrUsername = async (emailOrUsername) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }]
    }
  });
  if (!user) throw new UserNotFoundException();
  return user;
};

const signIn = async (emailOrUsername, password) => {
  const user = await _checkUserExistsWithLoginOrUsername(emailOrUsername);
  const authenticated = authenticate(password, user.password, user.salt);
  if (!authenticated) throw new WrongUserCredentialsException();
  const userPayload = {
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return generateAccessToken(userPayload);
};

const getVerifiedFromUser = async (emailOrUsername) => {
  return prisma.user.findFirst({
    select: {
      verified: true,
    },
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }]
    }
  });
};

const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true
    }
  });
};

const getUser = async (userId) => {
  return prisma.user.findFirst({
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true
    },
    where: {
      user_id: userId
    }
  });
};

const updateUser = async (userData, userId) => {
  return prisma.user.update({
    where: {
      user_id: userId
    },
    data: {
      ...userData
    },
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true
    },
  });
};

const deleteUser = async (userId) => {
  const query = `DELETE FROM users WHERE user_id = ${userId};`;
  return prisma.$queryRaw(query);
};

const createUser = async (username, email, role, password, verified) => {
  return signUp(username, email, role, password, verified);
};

const getUserByUsername = async (username) => {
  return prisma.user.findFirst({
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true
    },
    where: {
      username
    }
  });
};

module.exports = {
  signUp,
  signIn,
  createPendingUser,
  findPendingUserByConfirmCode,
  deleteVerifiedPendingUser,
  setVerifiedUser,
  getVerifiedFromUser,
  getUserByUsername,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
