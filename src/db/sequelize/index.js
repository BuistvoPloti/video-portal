const { Sequelize } = require('sequelize');
const User = require('./models/user');
const Video = require('./models/video');
const PendingUser = require('./models/pending-user');
const { applySetup } = require('./models-setup');
const { db: { databaseURL } } = require('../../config');

const sequelize = new Sequelize(databaseURL);

const models = [
  User,
  Video,
  PendingUser,
];

for (const model of models) {
  model(sequelize);
}

applySetup(sequelize);

module.exports = sequelize;
