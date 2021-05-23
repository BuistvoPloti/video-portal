const { addSourceToVideosList } = require('../../../utils/common');
const { videosService } = require('../../../services');

const findVideo = async (parent, args, context) => {
  const videoId = args.id;
  const video = await videosService.getVideo(videoId);
  if (!video) return {};
  const videoWithSourceLink = addSourceToVideosList([video]);
  return videoWithSourceLink[0];
};

const findVideos = async (parent, args, context) => {
  const videos = await videosService.getVideos();
  const videosWithSourceLink = addSourceToVideosList(videos);
  return videosWithSourceLink;
};

module.exports = {
  findVideo,
  findVideos
};
