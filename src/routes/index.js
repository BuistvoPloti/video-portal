const usersRoutes = require('./users');
const videosRoutes = require('./videos');
const authRoutes = require('./auth');

module.exports = (server) => {
  usersRoutes(server);
  videosRoutes(server);
  authRoutes(server);
};
