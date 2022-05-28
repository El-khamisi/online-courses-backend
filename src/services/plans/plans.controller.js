const { successfulRes, failedRes } = require('../../utils/response');
const { subscribe } = require('../../utils/subscribe');
const { planModel } = require('./plans.model');

exports.getPlans = async (req, res) => {
  try {
    const doc = await planModel.find().exec();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.editPlans = async (req, res) => {
  const body = req.body;
  try {
    body.forEach(async (e) => {
      const doc = await planModel.findByIdAndUpdate(
        e._id,
        {
          list: e.list,
          price: e.price,
        },
        { new: true }
      );
    });

    return successfulRes(res, 200, {});
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
