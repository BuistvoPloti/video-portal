jest.mock('../../../db/sequelize');
jest.mock('../../../services/aws/s3/videos-service');
jest.mock('../../../services/sequelize/users-service');
jest.mock('../../../services/sequelize/videos-service');
jest.mock('../../../utils/mailer');

const videosController = require('../../../controllers/videos');
const s3VideosService = require('../../../services/aws/s3/videos-service');
const usersService = require('../../../services/sequelize/users-service');
const videosService = require('../../../services/sequelize/videos-service');

jest.mock('../../../utils/request-wrappers', () => {
  const postBackVideoData = () => ({
    catch: jest.fn().mockReturnThis()
  });
  return {
    postBackVideoData
  };
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};
const mockRequest = () => {
  const req = {};
  req.params = jest.fn().mockReturnValue(req);
  const video = {
    size: 10000,
    path: '/some/path',
    name: 'test.MP4'
  };
  req.files = { video };
  req.query = {
    callbackURL: 'test.com'
  };
  req.user = {
    username: 'test',
  };
  return req;
};
const mockNext = () => jest.fn();

const req = mockRequest();
const res = mockResponse();
const next = mockNext();

const uploadVideoResponseData = {
  data:
    {
      video: {
        author: 'test',
        extension: 'MP4',
        full_name: 'test.MP4',
        name: 'test',
        size: '9.77 KB',
        url: 'https://videos-storage-for-nodejs-learning.s3.us-east-2.amazonaws.com/test/test.MP4'
      }
    }
};

describe('controllers/videos-controller', () => {
  afterEach(() => {
    jest.resetModules();
  });
  test('should upload a video', async () => {
    s3VideosService.uploadVideo.mockImplementation(() => Promise.resolve({}));
    usersService.getUserByUsername.mockImplementation(() => Promise.resolve({ user_id: 1 }));
    videosService.createVideo.mockImplementation(() => Promise.resolve({}));
    await videosController.uploadVideo(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(uploadVideoResponseData);
  });
});
