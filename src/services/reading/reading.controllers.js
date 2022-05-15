const Reading = require('./reading.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { freePlan, premiumPlan } = require('../../config/membership');

exports.getReadings = async (req, res) => {
  try {
    let q = req.query;

    const response = await Reading.find(q).select('title').sort('-createdAt');

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getReading = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = req.session.user;

    const doc = await Reading.findById(_id).exec();
    if (doc.membership == premiumPlan && user.membership == freePlan) {
      throw new Error(`You Are NOT allowed to see premium reading content`);
    }

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addReading = async (req, res) => {
  try {
    const { title, description, quizzes } = req.body;

    const saved = new Reading({
      title,
      description,
      quizzes,
    });

    await saved.save();
    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateReading = async (req, res) => {
  try {
    const _id = req.params.id;
    const { title, description } = req.body;

    const doc = await Reading.findById(_id).exec();

    doc.title = title ? title : doc.title;
    doc.description = description ? description : doc.description;

    await doc.save();
    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteReading = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Reading.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
