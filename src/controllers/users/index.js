const { usersService, videosService } = require('../../services');
const { sendConfirmationEmail } = require('../../utils/mailer');
const { generateConfirmationCode } = require('../../utils/security');
const {
  MissingUserIdException,
  WrongUserRoleSpecifiedException,
  InvalidUserDataException,
  InvalidConfirmationCodeException,
} = require('../../exceptions/exceptions');
const {
  sendSuccessResponse,
  sendErrorResponse
} = require('../../utils/response-helpers');
const {
  isObjectEmpty,
  copyObjectWithoutUndefined,
  addSourceToVideosList
} = require('../../utils/common');

const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const role = 'editor';
    const verified = false;
    const user = await usersService.signUp(username, email, role, password, verified);
    const userId = user.user_id;
    const confirmationCode = generateConfirmationCode();
    await usersService.createPendingUser(userId, confirmationCode);
    await sendConfirmationEmail(email, confirmationCode);
    const detail = 'Confirm your email';
    return sendSuccessResponse({ user, detail }, res);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const token = await usersService.signIn(login, password);

    res.setHeader('Authorization', token);
    return sendSuccessResponse({ token }, res);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers();
    return sendSuccessResponse({ users }, res);
  } catch (e) {
    sendErrorResponse(res, e);
    return next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await usersService.getUser(userId);
    return sendSuccessResponse({ user }, res);
  } catch (e) {
    sendErrorResponse(res, e);
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, email, role, password, verified = true } = req.body;
    const user = await usersService.createUser(username, email, role, password, verified);
    return sendSuccessResponse({ user }, res);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    if (!userId) throw new MissingUserIdException();
    const roles = new Set(['editor', 'admin']);
    const { role } = req.body;
    if (role && !roles.has(role)) {
      throw new WrongUserRoleSpecifiedException();
    }
    const rawUserData = {
      username: req.body.username,
      email: req.body.email,
      verified: req.body.verified,
      role,
    };
    const finalUserData = copyObjectWithoutUndefined(rawUserData);
    if (isObjectEmpty(finalUserData)) {
      throw new InvalidUserDataException();
    }

    const user = await usersService.updateUser(finalUserData, userId);
    return sendSuccessResponse({ user }, res);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    await usersService.deleteUser(userId);
    return sendSuccessResponse({}, res, 204);
  } catch (e) {
    sendErrorResponse(res, e);
    return next(e);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const confirmationCode = req.params.code;
    const pendingUser = await usersService.findPendingUserByConfirmCode(confirmationCode);
    if (!pendingUser) throw new InvalidConfirmationCodeException();

    const pendingUserId = pendingUser.pending_user_id;
    const userId = pendingUser.user_id;
    await usersService.deleteVerifiedPendingUser(pendingUserId);
    const user = await usersService.setVerifiedUser(userId);
    return sendSuccessResponse({ user }, res, 200);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

const getAllUserVideos = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const videos = await videosService.getAllUserVideos(userId);
    const videosWithSourceLink = addSourceToVideosList(videos);
    return sendSuccessResponse({ videos: videosWithSourceLink }, res);
  } catch (e) {
    sendErrorResponse(res, e);
    return next(e);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUser,
  deleteUser,
  signUp,
  signIn,
  verifyUser,
  getAllUserVideos,
};
