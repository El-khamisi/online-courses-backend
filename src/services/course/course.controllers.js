const Course = require('./course.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { upload_image } = require('../../config/cloudinary');

exports.getCourses = async (req, res) => {
  try {
    let q = req.query;

    let response = await Course.find(q).sort('-createdAt');

    if (response && response.length && response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        response[i] = await response[i].populate({ path: 'instructor', select: 'first_name last_name email photo' });
      }
    } else {
      response = await response.populate({ path: 'instructor', select: 'first_name last_name email photo' });
    }
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getCourse = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Course.findById(_id).exec();

    response = await response.populate({ path: 'instructor', select: 'first_name last_name email photo' });
    response = await response.populate({ path: 'lessons', select: 'name' });

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { name, price, instructor, text, list, membership, level } = req.body;
    const photo = req.file?.path;

    const saved = new Course({
      name,
      price,
      instructor,
      description: {
        text: text,
        list: list,
      },
      membership,
      photo,
      level,
    });

    if (photo) {
      saved.photo = await upload_image(photo, saved._id, 'courses_thumbs');
    }
    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, price, instructor, text, list, membership, level } = req.body;
    const photo = req.file?.path;

    let doc = await Course.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.price = price ? price : doc.price;
    doc.level = level ? level : doc.level;
    doc.instructor = instructor ? instructor : doc.instructor;
    doc.membership = membership ? membership : doc.membership;
    doc.description = {
      text: text ? text : doc.description.text,
      list: list ? list : doc.description.list,
    };
    if (photo) {
      doc.photo = await upload_image(photo, doc._id, 'courses_thumbs');
    }

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Course.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
