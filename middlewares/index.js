const { hasAuthToken } = require('middlewares/hasAuthToken');
const { isAuthenticated } = require('middlewares/isAuthenticated');

module.exports = {
  hasAuthToken,
  isAuthenticated,
};
