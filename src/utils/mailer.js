const nodemailer = require('nodemailer');
const { mailer: { email, password, port, service, host, baseVerifyUrl } } = require('../config');
const { log, logError } = require('./logger');

const sendConfirmationEmail = async (userEmail, confirmationCode) => {
  const transporter = nodemailer.createTransport({
    host,
    port,
    service,
    secure: false,
    logger: true,
    auth: {
      user: email,
      pass: password
    }
  });

  const mailOptions = {
    from: email,
    to: userEmail,
    subject: 'Confirmation email via video-service',
    text: `${baseVerifyUrl}/${confirmationCode}`
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (errorMessage, info) => {
      if (errorMessage) {
        const error = {
          message: errorMessage
        };
        logError(error);
        resolve(false);
      } else {
        log(`Email sent : ${info.response}`);
        resolve(true);
      }
    });
  });
};

module.exports = {
  sendConfirmationEmail,
};
