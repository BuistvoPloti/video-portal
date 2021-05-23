jest.mock('../../../db/sequelize');

const usersService = require('../../../services/sequelize/users-service');

const mockResponse = {
  data: {
    users: [
      {
        user_id: 1,
        username: 'user1',
        email: 'u1@g.com',
        role: 'editor'
      },
      {
        user_id: 2,
        username: 'user2',
        email: 'u2@g.com',
        role: 'admin'
      }
    ]
  }
};

describe('services/sequelize/users-service', () => {
  test('should find all users', async () => {
    const mock = jest.spyOn(usersService, 'getUsers');
    mock.mockImplementation(() => Promise.resolve(mockResponse));
    const response = await usersService.getUsers();
    expect(response).toStrictEqual(mockResponse);
    mock.mockRestore();
  });

  test('should generate token after sign in', async () => {
    const mock = jest.spyOn(usersService, 'signIn');
    const token = '1f2d4g1hc4g1l4tuc1tuc41';
    mock.mockImplementation(() => Promise.resolve(token));
    const response = await usersService.signIn('login', 'password');
    expect(response).toStrictEqual(token);
    mock.mockRestore();
  });
});
