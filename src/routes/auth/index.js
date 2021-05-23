const authController = require('../../controllers/auth');
const authRouteNamings = require('../../resources/routes.js').routes.auth;
const { auth } = require('../../middlewares/auth');

const authRoutes = (server) => {
  /**
   * @swagger
   * path:
   *   /auth/2fa/authenticate:
   *     post:
   *       summary: Authenticate with two factor authentication code
   *       consumes:
   *         - application/json
   *       parameters:
   *         - in: body
   *           name: twoFactorAuthenticationCode
   *           description: Authentication code
   *           required: true
   *           type: integer
   *           example: 235813
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       tags:
   *         - Two Factor Authentication
   *       responses:
   *         200:
   *           description: Access token
   *         400:
   *           description: invalid token
   *         403:
   *           description: User is not authorized or Two Factor Authentication code is invalid
   *         404:
   *           description: User not found
   */
  server.post(authRouteNamings.twoFactorAuth, auth, authController.secondFactorAuthentication);
  /**
   * @swagger
   * path:
   *   /auth/2fa/generate:
   *     post:
   *       summary: Generate QR code for Google Authenticator
   *       consumes:
   *         - application/json
   *       parameters:
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       tags:
   *         - Two Factor Authentication
   *       responses:
   *         200:
   *           description: QR code
   *         400:
   *           description: invalid token
   *         403:
   *           description: User is not authorized
   */
  server.post(authRouteNamings.twoFactorGenerate, auth, authController.generateTwoFactorAuthenticationCode);
};

module.exports = authRoutes;
