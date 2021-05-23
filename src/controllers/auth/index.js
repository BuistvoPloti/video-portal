const { generateAccessToken } = require('../../utils/security');
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require('../../utils/response-helpers');
const {
  TwoFactorAuthenticationCodeIsInvalidException
} = require('../../exceptions/exceptions');
const { authService } = require('../../services');
const { usersService } = require('../../services');

const generateTwoFactorAuthenticationCode = async (req, res, next) => {
  try {
    const { user } = req;
    const { email } = user;
    const userId = user.user_id;
    const { otpauthUrl, base32 } = authService.getTwoFactorAuthenticationCode(email);
    await usersService.setUserTwoFactorAuthCode(userId, base32);
    res.setHeader('content-type', 'image/png');
    return authService.respondWithQRCode(otpauthUrl, res);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

const secondFactorAuthentication = async (req, res, next) => {
  try {
    const { twoFactorAuthenticationCode } = req.body;
    const { user } = req;
    const { user_id } = user;
    const userTwoFactorAuthenticationCode = user.two_factor_authentication_code;

    const isCodeValid = await authService.verifyTwoFactorAuthenticationCode(
      twoFactorAuthenticationCode, userTwoFactorAuthenticationCode,
    );
    if (!isCodeValid) throw new TwoFactorAuthenticationCodeIsInvalidException();

    const userPayload = {
      username: user.username,
      email: user.email,
      role: user.role,
      twoFactorAuthPassed: true,
      user_id,
    };
    const token = generateAccessToken(userPayload);
    res.setHeader('Authorization', token);
    return sendSuccessResponse({ token }, res);
  } catch (e) {
    const { code } = e;
    sendErrorResponse(res, e, code);
    return next(e);
  }
};

module.exports = {
  generateTwoFactorAuthenticationCode,
  secondFactorAuthentication
};
