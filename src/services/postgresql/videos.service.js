const pool = require('../../db/postgresql').connectionPool;

const findVideoByPath = async (path) => {
  const query = {
    text: 'SELECT * FROM videos ' +
          'WHERE bucket_file_path = $1',
    values: [path]
  }
  return pool.query(query);
}

const createVideo = async (userId, bucketFilePath) => {
  const existingVideo = await findVideoByPath(bucketFilePath);
  if (existingVideo.rowCount) return;

  const query = {
    text: 'INSERT INTO videos(user_id, bucket_file_path) ' +
      'VALUES($1, $2)  RETURNING video_id, user_id, bucket_file_path',
    values: [userId, bucketFilePath]
  }
  const video = await pool.query(query);
  return video.rows;
}

module.exports = {
  createVideo,
}
