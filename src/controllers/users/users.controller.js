const usersService = require('../../services')

const getUserName = async (req, res, next) => {
  //const upperCaseName = usersService.nameToUpperCase(req.params.name)
  const users = await usersService.testing_pool()
  res.send({ 'name': users.rows });
  return next();
}

const signUp = async (req, res, next) => {
  try {
    const { username, email, role, password } = req.body;
    const user = await usersService.signUp(username, email, role, password);
    res.send({ data: user })
    return next();
  } catch (e) {
    res.send({ error: e })
  }
}

module.exports = {
  getUserName,
  signUp,
};
