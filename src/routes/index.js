const usersRoutes = require('./users');
const videosRoutes = require('./videos');

module.exports = server => {
  usersRoutes(server);
  videosRoutes(server);
};
