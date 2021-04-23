const usersController = require('../../controllers/users/users.controller');
const usersRouteNamings = require('../../config/routes.js').routes.users;

const usersRoutes = server => {
  server.get(usersRouteNamings.index, usersController.getUserName);
  server.post(usersRouteNamings.signUp, usersController.signUp);
}

module.exports = usersRoutes;
