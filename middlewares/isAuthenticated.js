const jwt = require('jsonwebtoken');

const User = require('model/user.model');

const isAuthenticated = async (req, res, next) => {
  if (!req.isAuth) {
    req.isAuth = false;
    delete req.authToken;
    return next();
  }
  try {
    const authData = jwt.verify(req.authToken, process.env.TOKEN_SECRET);
    if (!authData) {
      req.isAuth = false;
      delete req.authToken;
      return next();
    }
    const user = await User.findById(authData.userId);
    if (!user) {
      req.isAuth = false;
      delete req.authToken;
      return next();
    }
    req.isAuth = true;
    req.user = {
      ...user._doc,
      password: null,
    };
    return next();
  } catch (e) {
    req.isAuth = false;
    delete req.authToken;
    next();
  }
};

module.exports = { isAuthenticated };
