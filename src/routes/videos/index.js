const videosController = require('../../controllers/videos/videos.controller');
const videosRouteNamings = require('../../resources/routes.js').routes.videos;
const { checkVideoSize } = require('../../middlewares/checkVideoSize');
const { auth } = require('../../middlewares/auth');

const videosRoutes = server => {
  server.post(videosRouteNamings.index, auth, checkVideoSize, videosController.uploadVideo);
}

module.exports = videosRoutes;
