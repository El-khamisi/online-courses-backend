const User = require('../services/user/user.model');
const { Admin } = require('./roles');

const superAdmin = async () => {
  await User.findOneAndDelete({
    email: 'admin@test.com',
  }).exec();
  const prototype = {
    email: 'admin@test.com',
    password: 'admin123',
    role: Admin,
  };
  try {
    const saved = new User(prototype);
    await saved.save();
  } catch (e) {
    console.log('CAN NOT CREATE SUPER ADMIN' + e.message);
  }
};

module.exports = {
  superAdmin,
};
