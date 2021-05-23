const usersController = require('../../controllers/users');
const usersRouteNamings = require('../../resources/routes.js').routes.users;
const { auth } = require('../../middlewares/auth');
const { isSecondFactorAuthenticated } = require('../../middlewares/two-factor-auth-pass');
const { hasAdminRole } = require('../../middlewares/has-admin-role');
const { isUserVerified } = require('../../middlewares/verified');

/**
 * @swagger
 * definitions:
 *   UserResponse:
 *     type: object
 *     properties:
 *      data:
 *        type: object
 *        properties:
 *          user:
 *            type: object
 *            properties:
 *              user_id:
 *                type: integer
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              verified:
 *                type: boolean
 *              role:
 *                type: string
 */
/**
 * @swagger
 * definitions:
 *   UserSignUpForm:
 *     type: object
 *     required:
 *       - username
 *       - email
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *     example:
 *       username: test_username
 *       email: youremail@mail.com
 *       password: qwerty
 */
/**
 * @swagger
 * definitions:
 *   UserSignInForm:
 *     type: object
 *     required:
 *       - login
 *       - password
 *     properties:
 *       login:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *     example:
 *       login: test_login
 *       password: qwerty
 */
/**
 * @swagger
 * definitions:
 *   UserUpdateForm:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       user_id:
 *         type: integer
 *       email:
 *         type: string
 *       verified:
 *         type: boolean
 *       role:
 *         type: string
 *     example:
 *       user_id: 1
 *       email: newmail@gmail.com
 *       verified: true
 */
/**
 * @swagger
 * definitions:
 *   UserCreateForm:
 *     type: object
 *     required:
 *       - username
 *       - email
 *       - role
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       role:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *     example:
 *       username: newtestuser
 *       email: testnewuser@gmail.com
 *       role: admin
 *       password: qwe123
 */
const usersRoutes = (server) => {
  /**
   * @swagger
   * path:
   *   /users/verify/{code}:
   *     get:
   *       summary: Verify email
   *       parameters:
   *         - name: code
   *           in: path
   *           required: true
   *           description: User confirmation code
   *       description: Verify user with confirmation code
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: Verified user data
   *         400:
   *           description: Specified confirmation code is invalid
   */
  server.get(usersRouteNamings.verify, usersController.verifyUser);
  /**
   * @swagger
   * path:
   *   /users/{id}/videos:
   *     get:
   *       summary: Finds user videos
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The user id
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Finds user videos
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: User videos list
   *         400:
   *           description: Invalid token
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.get(usersRouteNamings.findVideos, auth, isSecondFactorAuthenticated, hasAdminRole, usersController.getAllUserVideos);
  /**
   * @swagger
   * path:
   *   /users:
   *     get:
   *       summary: Finds all users
   *       parameters:
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Finds all users
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: Users list
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.get(usersRouteNamings.index, auth, isSecondFactorAuthenticated, hasAdminRole, usersController.getUsers);
  /**
   * @swagger
   * path:
   *   /users/{id}:
   *     get:
   *       summary: Finds user by id
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The user id
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Finds user by id
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: The user by id
   *           schema:
   *             $ref: '#/definitions/UserResponse'
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.get(usersRouteNamings.findById, auth, isSecondFactorAuthenticated, hasAdminRole, usersController.getUser);
  /**
   * @swagger
   * path:
   *   /users:
   *     post:
   *       summary: Creates user
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: user
   *           description: User data
   *           schema:
   *             $ref: '#/definitions/UserCreateForm'
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Creates user
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: New user data
   *         403:
   *           description: User is not authorized or is not admin
   *         409:
   *           description: User with such credentials already exists
   */
  server.post(usersRouteNamings.index, auth, hasAdminRole, usersController.createUser);
  /**
   * @swagger
   * path:
   *   /users:
   *     patch:
   *       summary: Update user
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: user
   *           description: User data
   *           schema:
   *             $ref: '#/definitions/UserUpdateForm'
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: Updated user
   *         400:
   *           description: Wrong user role specified
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.patch(usersRouteNamings.index, auth, isSecondFactorAuthenticated, hasAdminRole, usersController.updateUser);
  /**
   * @swagger
   * path:
   *   /users/{id}:
   *     delete:
   *       summary: Deletes user by id
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The user id
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Deletes user by id
   *       tags:
   *         - Users
   *       responses:
   *         204:
   *           description: No content
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.del(usersRouteNamings.findById, auth, isSecondFactorAuthenticated, hasAdminRole, usersController.deleteUser);
  /**
   * @swagger
   * path:
   *   /users/signup:
   *     post:
   *       summary: Sign up
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: user
   *           description: User data
   *           schema:
   *             $ref: '#/definitions/UserSignUpForm'
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: New user data
   *         409:
   *           description: User with such credentials already exists
   */
  server.post(usersRouteNamings.signUp, usersController.signUp);
  /**
   * @swagger
   * path:
   *   /users/signin:
   *     post:
   *       summary: Sign in
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: user
   *           description: User data
   *           schema:
   *             $ref: '#/definitions/UserSignInForm'
   *           example:
   *             login is username or email
   *       tags:
   *         - Users
   *       responses:
   *         200:
   *           description: Access token
   *         403:
   *           description: Wrong credentials
   *         404:
   *           description: User not found
   */
  server.post(usersRouteNamings.signIn, isUserVerified, usersController.signIn);
};

module.exports = usersRoutes;
