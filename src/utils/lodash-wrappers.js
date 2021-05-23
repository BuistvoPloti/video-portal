const _ = require('lodash');

const getFirstItemFromPgQuery = (obj) => {
  return _.get(obj, 'rows[0]', []);
};

module.exports = {
  getFirstItemFromPgQuery,
};
