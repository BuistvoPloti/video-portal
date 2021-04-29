const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
  application: { tokenSecret, jwtExpiresIn },
} = require("../config");

const authenticate = (plainPassword, hashedPassword, salt) => {
  return encryptPassword(plainPassword, salt) === hashedPassword;
};

const makeSalt = () => {
  return Math.round(new Date().valueOf() * Math.random()) + "";
};

const encryptPassword = (password, salt) => {
  if (!password) return "";
  try {
    return crypto
      .createHmac("sha1", salt)
      .update(password)
      .digest("hex");
  } catch (err) {
    return "some error!";
  }
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, tokenSecret, { expiresIn: `${jwtExpiresIn}d` });
}

module.exports = {
  makeSalt,
  encryptPassword,
  authenticate,
  generateAccessToken
};
