const videosController = require('../../controllers/videos');
const videosRouteNamings = require('../../resources/routes.js').routes.videos;
const { checkVideoSize } = require('../../middlewares/check-video-size');
const { auth } = require('../../middlewares/auth');
const { hasAdminRole } = require('../../middlewares/has-admin-role');
const { isSecondFactorAuthenticated } = require('../../middlewares/two-factor-auth-pass');

/**
 * @swagger
 * definitions:
 *   VideoResponse:
 *     type: object
 *     properties:
 *      data:
 *        type: object
 *        properties:
 *          video:
 *            type: object
 *            properties:
 *              user_id:
 *                type: integer
 *              video_id:
 *                type: integer
 *              bucket_file_path:
 *                type: string
 *              source:
 *                type: string
 */
/**
 * @swagger
 * definitions:
 *   VideosResponse:
 *     type: object
 *     properties:
 *      data:
 *        type: object
 *        properties:
 *          videos:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                user_id:
 *                  type: integer
 *                video_id:
 *                  type: integer
 *                bucket_file_path:
 *                  type: string
 *                source:
 *                  type: string
 */
/**
 * @swagger
 * definitions:
 *   VideoMetaDataResponse:
 *     type: object
 *     properties:
 *      data:
 *        type: object
 *        properties:
 *          video:
 *            type: object
 *            properties:
 *              url:
 *                type: integer
 *              name:
 *                type: integer
 *              extension:
 *                type: string
 *              full_name:
 *                type: string
 *              size:
 *                type: string
 *              author:
 *                type: string
 */
const videosRoutes = (server) => {
  /**
   * @swagger
   * path:
   *   /videos:
   *     post:
   *       summary: Uploads a video
   *       consumes:
   *         - multipart/form-data
   *       parameters:
   *         - in: query
   *           name: callbackURL
   *           type: string
   *           description: A callback url
   *         - in: formData
   *           name: video
   *           type: file
   *           description: Video to upload
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Uploads a video
   *       tags:
   *         - Videos
   *       responses:
   *         200:
   *           description: Uploaded video metadata
   *           schema:
   *             $ref: '#/definitions/VideoMetaDataResponse'
   *         400:
   *           description: Bad request
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.post(videosRouteNamings.index, auth, isSecondFactorAuthenticated, checkVideoSize, videosController.uploadVideo);
  /**
   * @swagger
   * path:
   *   /videos/{id}:
   *     delete:
   *       summary: Deletes video by id
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The video id
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Deletes video by id
   *       tags:
   *         - Videos
   *       responses:
   *         204:
   *           description: Video deleted No content
   *         403:
   *           description: User is not authorized or is not admin
   *         409:
   *           description: Error while deleting video
   */
  server.del(videosRouteNamings.findById, auth, isSecondFactorAuthenticated, hasAdminRole, videosController.deleteVideo);
  /**
   * @swagger
   * path:
   *   /videos:
   *     get:
   *       summary: Finds all videos
   *       parameters:
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Finds all videos
   *       tags:
   *         - Videos
   *       responses:
   *         200:
   *           description: All videos list
   *           schema:
   *             $ref: '#/definitions/VideosResponse'
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.get(videosRouteNamings.index, auth, isSecondFactorAuthenticated, hasAdminRole, videosController.getVideos);
  /**
   * @swagger
   * path:
   *   /videos/{id}:
   *     get:
   *       summary: Finds video by id
   *       parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           description: The video id
   *         - name: Authorization
   *           in: header
   *           description: Authorization header
   *           required: true
   *           type: string
   *           example: Bearer k45hkv3hk5v353414
   *       description: Finds video by id
   *       tags:
   *         - Videos
   *       responses:
   *         200:
   *           description: The video by id
   *           schema:
   *             $ref: '#/definitions/VideoResponse'
   *         403:
   *           description: User is not authorized or is not admin
   */
  server.get(videosRouteNamings.findById, auth, isSecondFactorAuthenticated, hasAdminRole, videosController.getVideo);
};

module.exports = videosRoutes;
