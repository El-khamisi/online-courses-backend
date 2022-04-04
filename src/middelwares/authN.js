const jwt = require('jsonwebtoken');
const { TOKENKEY } = require('../config/env');
const { failedRes } = require('../utils/response');

exports.authN = (req, res, next) => {
  try {
    if (!req.cookies.authorization) {
      throw new Error('Login first');
    }
    const token = req.cookies.authorization.split(' ')[1];
    const verify = jwt.verify(token, TOKENKEY);
    res.locals.user = verify;
    next();
  } catch (e) {
    return failedRes(res, 401, e);
  }
};
