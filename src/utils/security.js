const crypto = require('crypto');

const makeSalt = () => {
  return Math.round(new Date().valueOf() * Math.random()) + "";
}

const encryptPassword = (password, salt) => {
  if (!password) return "";
  try {
    return crypto
      .createHmac("sha1", salt)
      .update(password)
      .digest("hex");
  } catch (err) {
    return "";
  }
};

module.exports = {
  makeSalt,
  encryptPassword,
}
