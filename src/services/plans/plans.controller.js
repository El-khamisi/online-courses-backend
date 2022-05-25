const { successfulRes, failedRes } = require('../../utils/response');
const { subscribe } = require('../../utils/subscribe');
const { planModel } = require('./plans.model');

exports.getPlans = async (req, res) => {
  const q = req.query;
  try {
    const doc = await planModel.find(q).exec();
    const gdate = new Date();
    for (const e of doc) {
      const docDate = e.rateEGP.toISOString().split('T')[0];
      const date = gdate.toISOString().split('T')[0];
      console.log(docDate, date);
      console.log(docDate < date);
      if (docDate < date) {
      }
    }

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
