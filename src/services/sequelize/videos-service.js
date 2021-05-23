const { models } = require('../../db/sequelize');

const findVideoByPath = async (path) => {
  return models.video.findOne({
    where: {
      bucket_file_path: path
    },
    raw: true,
  });
};

const createVideo = async (userId, bucketFilePath, t) => {
  const existingVideo = await findVideoByPath(bucketFilePath);
  if (existingVideo) return {};
  const data = {
    user_id: userId,
    bucket_file_path: bucketFilePath
  };
  return models.video.create(data, { transaction: t });
};

const getAllUserVideos = async (userId) => {
  return models.video.findAll({
    where: {
      user_id: userId,
    },
    raw: true,
  });
};

const getVideo = async (videoId) => {
  return models.video.findOne({
    where: {
      video_id: videoId,
    },
    raw: true,
  });
};

const getVideos = async () => {
  return models.video.findAll({
    order: [
      ['user_id', 'ASC'],
    ],
    raw: true,
  });
};

const deleteVideo = async (videoId, t) => {
  return models.video.destroy({
    where: {
      video_id: videoId
    },
    transaction: t
  });
};

module.exports = {
  findVideoByPath,
  createVideo,
  getAllUserVideos,
  getVideo,
  getVideos,
  deleteVideo
};
