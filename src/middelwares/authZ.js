const { Admin, Student, Instructor } = require('../config/roles');
const { premiumPlan } = require('../config/membership');
const { failedRes } = require('../utils/response');

exports.isAdmin = (req, res, next) => {
  try {
    const role = res.locals.user.role;
    if (role && role == Admin) return next();
    else throw new Error('You are NOT authorized to Admins Only Routes');
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.isInstructor = (req, res, next) => {
  try {
    const role = res.locals.user.role;
    if (role && role == Instructor) return next();
    else throw new Error('You are NOT authorized to Instructor Routes');
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.isPremium = async (req, res, next) => {
  try {
    const role = res.locals.user.role;
    const membership = res.locals.user.membership;
    if (role && role == Admin) return next();

    if (membership && membership == premiumPlan) return next();

    throw new Error('You do NOT have a premium plan subscription');
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};
