const User = require('../user/user.model');
const Verification = require('./email-verification.model');
const { failedRes, successfulRes } = require('../../utils/response');

exports.emailVerification = async (req, res) => {
  const hash = req.params.hash;
  try {
    const hashDoc = await Verification.findOne({ verification_hash: hash }).exec();
    if (hashDoc) {
      const user = await User.findById(hashDoc.user_id).exec();
      user.isVerified = true;
      await user.save();
      await hashDoc.remove();
      return successfulRes(res, 200, { msg: 'Email verified successfully' });
    } else {
      throw new Error('Invalid verification link');
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
