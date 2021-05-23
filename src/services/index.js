// in order to switch service just change folder name src/services/your-services-folder
const services = require('auto-load')('src/services/sequelize');

module.exports = {
  ...services,
};
