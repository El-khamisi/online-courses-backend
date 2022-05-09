const User = require('../user/user.model');
const bcrypt = require('bcrypt');
const { successfulRes, failedRes } = require('../../utils/response');

exports.regUser = async (req, res) => {
  try {
    const {email, password, role} = req.body;
    if (email && password) {
      password = bcrypt.hashSync(password, 10);
    } else {
      throw new Error('Email and password are REQUIRED');
    }
    const saved = new User({email, password, role});
    await saved.save();

    const token = saved.generateToken(res);
    saved = await saved.populate({path: 'completed inprogress'});
    saved.password = undefined;
    req.session.user = saved;
    return successfulRes(res, 201, { token });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logUser = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return failedRes(res, 400, null, 'Email and password are REQUIRED');
  }

  try {
    let logged = await User.findOne({
      email,
    }).exec();
    if (!logged) {
      return failedRes(res, 400, null, 'Email is invalid');
    }

    const matched = bcrypt.compareSync(password, logged.password);
    if (!logged || !matched) {
      return failedRes(res, 400, null, 'Email or Password is invalid');
    }
    const token = logged.generateToken(res);
    logged = await logged.populate({path: 'completed inprogress'});
    logged.password = undefined;
    req.session.user = logged;
    return successfulRes(res, 200, { token });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logout = (req, res) => {
  try {
    //irrelevant
    res.clearCookie('authorization');
    successfulRes(res, 200, 'You have been logged out successfully');
  } catch (err) {
    failedRes(res, 500, 'Invalid logout operation');
  }
};
