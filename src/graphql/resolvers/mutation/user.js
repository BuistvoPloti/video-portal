const { sendConfirmationEmail } = require('../../../utils/mailer');
const { generateConfirmationCode } = require('../../../utils/security');
const { usersService } = require('../../../services');

const signUp = async (parent, args, context) => {
  const { username, email, password } = context.req.body.variables.user;
  const role = 'editor';
  const verified = false;
  const user = await usersService.signUp(username, email, role, password, verified);
  const userId = user.user_id;
  const confirmationCode = generateConfirmationCode();
  await usersService.createPendingUser(userId, confirmationCode);
  await sendConfirmationEmail(email, confirmationCode);
  return user;
};

module.exports = {
  signUp
};
