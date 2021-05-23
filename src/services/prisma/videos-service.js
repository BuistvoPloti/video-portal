const prisma = require('../../db/prisma');

const findVideoByPath = async (path) => {
  return prisma.video.findFirst({
    where: {
      bucket_file_path: path
    }
  });
};

const createVideo = async (userId, bucketFilePath) => {
  const existingVideo = await findVideoByPath(bucketFilePath);
  if (existingVideo) return {};
  const data = {
    user_id: userId,
    bucket_file_path: bucketFilePath
  };
  return prisma.video.create({
    data
  });
};

module.exports = {
  createVideo,
};
