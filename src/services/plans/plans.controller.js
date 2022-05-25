const { successfulRes, failedRes } = require('../../utils/response');
const { subscribe } = require('../../utils/subscribe');
const { planModel } = require('./plans.model');

exports.getPlans = async (req, res) => {
  const q = req.query;
  try {
    const doc = await planModel.find(q).exec();
    const gdate = new Date();
    for(const e of doc){
      const docDate = e.rateEGP.toISOString().split('T')[0]
      const date = gdate.toISOString().split('T')[0]
      console.log(docDate, date)
      console.log(docDate < date)
    }

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
