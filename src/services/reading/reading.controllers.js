const Reading = require('./reading.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getReadings = async (req, res) => {
  try {
    let q = req.query;
    let response;

    if (q.title) {
      response = await Reading.find({
        title: q.title,
      }).exec();
    } else {
      response = await title.find({}).exec();
    }

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getReading = async (req, res) => {
  try {
    const _id = req.params.id;

    const doc = await Reading.findById(course_id).exec();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addReading = async (req, res) => {
  try {
    const { title, description } = req.body;

    const saved = new Reading({
      title,
      description,
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
