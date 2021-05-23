const speakeasy = require('speakeasy');
const qrCode = require('qrcode');

const getTwoFactorAuthenticationCode = (userEmail) => {
  const otpSecrets = speakeasy.generateSecret({
    name: userEmail
  });
  return {
    base32: otpSecrets.base32,
    otpauthUrl: otpSecrets.otpauth_url,
  };
};

const respondWithQRCode = (data, response) => {
  return qrCode.toFileStream(response, data);
};

const verifyTwoFactorAuthenticationCode = (
  twoFactorAuthenticationCode,
  userTwoFactorAuthenticationCode
) => {
  const encoding = 'base32';
  return speakeasy.totp.verify({
    secret: userTwoFactorAuthenticationCode,
    token: twoFactorAuthenticationCode,
    encoding,
  });
};

module.exports = {
  getTwoFactorAuthenticationCode,
  respondWithQRCode,
  verifyTwoFactorAuthenticationCode,
};
