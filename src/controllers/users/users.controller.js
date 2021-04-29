const usersService = require('../../services');
const { throwCustomException } = require("../../utils/response-helpers");
const {
  handleSuccessResponse,
  handleErrorResponse
} = require('../../utils/response-helpers');
const { errorLogger } = require('../../utils/logger-wrappers');
const {
  isObjectEmpty,
  copyObjectWithoutUndefined
} = require('../../utils/common');

const getUserName = async (req, res, next) => { // test route
  const users = await usersService.testing_pool()
  res.send({ 'users': users.rows });
  return next();
}

const signUp = async (req, res, next) => {
  try {
    const { username, email, role, password } = req.body;
    const user = await usersService.signUp(username, email, role, password);
    return handleSuccessResponse({ user }, res);
  } catch (e) {
    const code = e.message.includes('exists') ? 409 : 500;
    errorLogger(e)
    handleErrorResponse(res, e, code);
    return next();
  }
}

const signIn = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const token = await usersService.signIn(login, password);

    res.setHeader('Authorization', token);
    return handleSuccessResponse({ token }, res);
  } catch (e) {
    errorLogger(e);
    handleErrorResponse(res, e);
    return next();
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers();
    return handleSuccessResponse({ users }, res);
  } catch (e) {
    errorLogger(e);
    handleErrorResponse(res, e);
    return next();
  }
}

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await usersService.getUser(userId);
    return handleSuccessResponse({ user }, res);
  } catch (e) {
    errorLogger(e);
    handleErrorResponse(res, e);
    return next();
  }
}

const createUser = async (req, res, next) => {
  try {
    const { username, email, role, password } = req.body;
    const user = await usersService.createUser(username, email, role, password);
    return handleSuccessResponse({ user }, res);
  } catch (e) {
    errorLogger(e);
    handleErrorResponse(res, e);
    return next();
  }
}

const updateUser = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    if (!userId) throwCustomException('user_id is not provided')

    const role = req.body.role;
    if (role !== 'editor' && role !== 'admin') throwCustomException('Wrong role specified')

    const rawUserData = {
      username: req.body.username,
      email: req.body.email,
      role,
    }
    const finalUserData = copyObjectWithoutUndefined(rawUserData);
    if (isObjectEmpty(finalUserData)) {
      throwCustomException('Invalid user data')
    }

    const user = await usersService.updateUser(finalUserData, userId)
    return handleSuccessResponse({ user }, res);
  } catch (e) {
    errorLogger(e);
    handleErrorResponse(res, e);
    return next();
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await usersService.deleteUser(userId);
    return handleSuccessResponse({}, res, 204);
  } catch (e) {
    errorLogger(e);
    handleErrorResponse(res, e);
    return next();
  }
}

module.exports = {
  getUserName,
  createUser,
  updateUser,
  getUsers,
  getUser,
  deleteUser,
  signUp,
  signIn,
};
