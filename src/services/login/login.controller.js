const User = require('../user/user.model');
const bcrypt = require('bcrypt');
const { successfulRes, failedRes } = require('../../utils/response');
const { premiumPlan, freePlan } = require('../../config/membership');
const { plansNames } = require('../plans/plans.model');
const { setS_id } = require('../../utils/cookie');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');

exports.regUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password } = req.body;
    if (email && password) {
      password = bcrypt.hashSync(password, 10);
    } else {
      throw new Error('Email and password are REQUIRED');
    }
    let saved = new User({ first_name, last_name, email, password });
    await saved.save();

    const token = saved.generateToken(req, res);

    req.session.user = saved;

    saved.completed = undefined;
    saved.reads = undefined;
    saved.inprogress = undefined;
    saved.password = undefined;
    saved.quizzes = undefined;
    setS_id(req, res);
    return successfulRes(res, 201, { user: saved, token });
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
    logged.password = undefined;
    if (!logged || !matched) {
      return failedRes(res, 400, null, 'Email or Password is invalid');
    } else {
      const token = logged.generateToken(req, res);
      const date = new Date().toISOString().split('T')[0];
      if (logged.membership == premiumPlan && date > logged.end_of_membership) {
        logged.membership = freePlan;
        logged.memberplan = plansNames.None;
        await logged.save();
      }

      req.session.user = logged;

      const user = { ...logged._doc };
      user.completed = undefined;
      user.reads = undefined;
      user.inprogress = undefined;
      user.quizzes = undefined;

      setS_id(req, res);
      return successfulRes(res, 200, { user: user, token });
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy(() => {});
    const session = MongoStore.create({ client: mongoose.connection.getClient() });
    session.destroy(req.sessionID);

    res.clearCookie('authorization');
    return successfulRes(res, 200, 'You have been logged out successfully');
  } catch (err) {
    return failedRes(res, 500, 'Invalid logout operation');
  }
};

exports.resetPassword = async (req, res) => {
  const {current_password, new_password} = req.body;
  const user_id = res.locals.user.id;
  try {
    const user = await User.findById(user_id).exec();
    if (!user) {
      return failedRes(res, 400, new Error('User not found'));
    }
    const matched = bcrypt.compareSync(current_password, user.password);
    if (!matched) {
      return failedRes(res, 400, new Error('Current password is invalid'));
    }else{
      user.password = bcrypt.hashSync(new_password, 10);
      await user.save();
      return successfulRes(res, 200, 'Password has been changed successfully');
    }

  }catch(e){
    return failedRes(res, 500, e);
  }
};