const User = require('../services/user/user.model');
const { Admin } = require('./roles');
const bcrypt = require('bcrypt');
const { premiumPlan } = require('./membership');
const {plansNames} = require('../services/plans/plans.model');

const superAdmin = async () => {
  await User.findOneAndDelete({
    email: 'admin@test.com',
  }).exec();
  const prototype = {
    first_name: 'cup',
    last_name: 'cake',
    email: 'admin@test.com',
    password: 'admin123',
    role: Admin,
    membership: premiumPlan,
    memberplan: plansNames.Biannual,
    quizzes: []
  };
  try {
    const saved = new User(prototype);
    if (prototype.password) {
      saved.password = bcrypt.hashSync(prototype.password, 10);
    } else {
      throw new Error('Invalid Password');
    }
    await saved.save();
  } catch (e) {
    console.log('CAN NOT CREATE SUPER ADMIN' + e.message);
  }
};

module.exports = {
  superAdmin,
};
