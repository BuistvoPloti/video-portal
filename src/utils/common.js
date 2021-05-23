const _ = require('lodash');
const { aws: { videosBucketUrl } } = require('../config');

const bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const isObjectEmpty = object => Object.entries(object).length === 0;

const copyObjectWithoutUndefined = (initialObject) => {
  return _.omitBy(initialObject, _.isUndefined);
};

const createVideoMetadataObject = (video, user) => (
  {
    size: bytesToSize(video.size),
    filePath: video.path,
    fileFullName: video.name,
    nameAndExtension: video.name.split('.'),
    fileName: video.name.split('.')[0],
    extension: video.name.split('.')[1],
    bucketKey: `${user.username}/${video.name}`,
    author: user.username,
  }
);

const addSourceToVideosList = (videos) => {
  if (_.isArray && _.isNull(videos[0])) return [{}];
  return _.map(videos, it => _.extend({ source: `${videosBucketUrl}/${it.bucket_file_path}` }, it));
};

const timer = (cb, ms = 4000) => {
  setTimeout(() => cb(), ms);
};

module.exports = {
  bytesToSize,
  timer,
  isObjectEmpty,
  copyObjectWithoutUndefined,
  createVideoMetadataObject,
  addSourceToVideosList
};
