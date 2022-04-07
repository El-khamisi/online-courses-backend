const Course = require('./course.model');
const { Instructor } = require('../../config/roles');
const { filterByMembership } = require('../../utils/filterCourses');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getCourses = async (req, res) => {
  try {
    let q = req.query;
    let response;
    const user_id = res.locals.user.id;
    const role = res.locals.user.role;
    const membership = res.locals.user.membership;

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

    //filter Response
    response = filterByMembership(response, membership, role, user_id);

    if (response && response.length && response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        response[i] = await response[i].populate({ path: 'instructor', select: 'first_name last_name email thumbnail' });
        response[i] = await response[i].populate({ path: 'lessons', select: 'name' });
      }
    } else {
      response = await response.populate({ path: 'instructor', select: 'first_name last_name email thumbnail' });
      response = await response.populate({ path: 'lessons', select: 'name' });
    }
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const user_id = res.locals.user.id;
    const role = res.locals.user.role;
    const membership = res.locals.user.membership;
    let response = await Course.findById(_id).exec();

    response = filterByMembership(response, membership, role, user_id);

    response = await response.populate({ path: 'instructor', select: 'first_name last_name email thumbnail' });
    response = await response.populate({ path: 'lessons', select: 'name' });

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { name, price, instructor, text, list, membership } = req.body;
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
    const { name, price, instructor, text, list, membership } = req.body;
    const photo = req.file?.path;

    let doc = await Course.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.price = price ? price : doc.price;
    doc.instructor = instructor ? instructor : doc.instructor;
    doc.membership = membership ? membership : doc.membership;
    doc.description = {
      text: text ? text : doc.description.text,
      list: list ? list : doc.description.list,
    };
    doc.photo = photo ? photo : doc.photo;

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
