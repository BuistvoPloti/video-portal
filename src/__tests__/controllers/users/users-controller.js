jest.mock('../../../db/sequelize');
jest.mock('../../../services/sequelize/users-service');
jest.mock('../../../utils/mailer');

const usersController = require('../../../controllers/users');
const usersService = require('../../../services/sequelize/users-service');

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
  req.body = {
    login: 'login',
    password: 'password',
    email: 'email',
    role: 'role',
    verified: 'verified'
  };
  return req;
};
const mockNext = () => jest.fn();

const req = mockRequest();
const res = mockResponse();
const next = mockNext();

const getShapedResponse = (property, value) => ({
  data: {
    [property]: value
  }
});

const userMock = {
  user_id: 1,
  username: 'user1',
  email: 'u1@.asd',
  role: 'editor'
};

const token = 'eyJhbGciOiJIUzI1NIJXec0';

describe('controllers/users-controller', () => {
  afterEach(() => {
    jest.resetModules();
  });
  test('should sign up a user', async () => {
    usersService.signUp.mockImplementation(() => Promise.resolve(userMock));
    usersService.createPendingUser.mockImplementation(() => Promise.resolve(''));
    await usersController.signUp(req, res, next);
    expect(res.status).toBeCalledWith(200);
    const user = getShapedResponse('user', userMock);
    user.data.detail = 'Confirm your email';
    expect(res.json).toBeCalledWith(user);
  });
  test('should sign in user', async () => {
    usersService.signIn.mockImplementation(() => Promise.resolve(token));
    await usersController.signIn(req, res, next);
    expect(res.status).toBeCalledWith(200);
    const response = getShapedResponse('token', token);
    expect(res.json).toBeCalledWith(response);
  });
  test('should create a new user', async () => {
    usersService.createUser.mockImplementation(() => Promise.resolve(userMock));
    await usersController.createUser(req, res, next);
    expect(res.status).toBeCalledWith(200);
    const user = getShapedResponse('user', userMock);
    expect(res.json).toBeCalledWith(user);
  });
});
