const usersRoutes = require('./users');

module.exports = server => {
  usersRoutes(server);
};
