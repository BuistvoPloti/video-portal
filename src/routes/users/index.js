const usersController = require('../../controllers/users/users.controller');
const usersRouteNamings = require('../../resources/routes.js').routes.users;
const { auth } = require('../../middlewares/auth');
const { hasRole } = require('../../middlewares/hasRole');

const usersRoutes = server => {
  server.get(usersRouteNamings.index, auth, hasRole, usersController.getUsers);
  server.get(usersRouteNamings.findById, auth, hasRole, usersController.getUser);
  server.post(usersRouteNamings.index, auth, hasRole, usersController.createUser);
  server.patch(usersRouteNamings.findById, auth, hasRole, usersController.updateUser);
  server.del(usersRouteNamings.findById, auth, hasRole, usersController.deleteUser);

  server.post(usersRouteNamings.signUp, usersController.signUp);
  server.post(usersRouteNamings.signIn, usersController.signIn);
}

module.exports = usersRoutes;
