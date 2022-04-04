const Course = require('./course.model');

exports.getCourses = async (req, res) => {
  try {
    let q = req.query;
    let response;

    if (q.name) {
      response = await Course.find({
        name: q.name,
      }).exec();
    } else if (q.instructor) {
      response = await Course.find({
        instructor: q.instructor,
      }).exec();
    } else {
      response = await Course.find({}).exec();
    }
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Course.findById(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { name, price, instructor, text, list } = req.body;

    const saved = new Course({
      name,
      price,
      instructor,
      description: {
        text: text,
        list: list,
      },
    });

    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, price, instructor, text, list } = req.body;
    const doc = await Course.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.price = price ? price : doc.price;
    doc.instructor = instructor ? instructor : doc.instructor;

    doc.description = {
      text: text ? text : doc.description.text,
      list: list ? list : doc.description.list,
    };

    await doc.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
