const crypto = require('crypto');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const {
  application: { tokenSecret, jwtExpiresIn },
} = require('../config');

const makeSalt = () => `${Math.round(new Date().valueOf() * Math.random())}`;

const encryptPassword = (password, salt) => {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return 'some error!';
  }
};

const authenticate = (plainPassword, hashedPassword, salt) => {
  return encryptPassword(plainPassword, salt) === hashedPassword;
};

const generateAccessToken = payload => jwt.sign(payload, tokenSecret, { expiresIn: `${jwtExpiresIn}d` });

const generateConfirmationCode = () => {
  const codeLength = 64;
  return randomstring.generate({
    length: codeLength,
  });
};

const excludePasswordSalt = (obj) => {
  return _.omit(obj, ['password', 'salt']);
};

module.exports = {
  makeSalt,
  encryptPassword,
  authenticate,
  generateAccessToken,
  generateConfirmationCode,
  excludePasswordSalt
};
