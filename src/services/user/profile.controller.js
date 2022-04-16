const User = require('./user.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.profileView = async (req, res) => {
  try {
    const _id = res.locals.user.id;
    let response = await User.findById(_id).exec();
    response.password = undefined;

    response = await response.populate({ path: 'completed', select: 'name instructor description photo membership' });
    response = await response.populate({ path: 'inprogress' });

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    const _id = res.locals.user.id;
    const { first_name, last_name, email, phone, password, role, membership } = req.body;
    const photo = req.file?.path;

    let doc = await User.findById(_id);

    doc.first_name = first_name ? first_name : doc.first_name;
    doc.last_name = last_name ? last_name : doc.last_name;
    doc.email = email ? email : doc.email;
    doc.phone = phone ? phone : doc.phone;
    doc.password = password ? password : doc.password;

    // doc.membership = membership ? membership : doc.membership;
    doc.photo = photo ? photo : doc.photo;

    const valid = doc.validateSync();
    if (valid) throw valid;
    await doc.save();
    doc.password = undefined;
    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.profileDelete = async (req, res) => {
  try {
    const _id = res.locals.user.id;

    const response = await User.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.mycourses = async (req, res) => {};
exports.enroll = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const _id = res.locals.user.id;

    let doc = await User.findById(_id).exec();

    doc.inprogress.forEach((e) => {
      if (e.course == course_id) throw new Error('Your have already enrolled to this course');
    });
    doc.completed.forEach((e) => {
      if (e == course_id) throw new Error('Your have already completed to this course');
    });

    doc.inprogress.push({ course: course_id, lessons: [] });
    await doc.save();
    doc.password = undefined;
    return successfulRes(res, 201, course_id);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.learn = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const lesson_id = req.params.lesson_id;
    const _id = res.locals.user.id;

    let doc = await User.findById(_id).exec();

    for (let i = 0; i < doc.inprogress.length; i++) {
      if (doc.inprogress[i].course == course_id) {
        let bool = false;
        for (let j = 0; j < doc.inprogress[i].lessons.length; j++) {
          if (doc.inprogress[i].lessons[j] == lesson_id) {
            bool = true;
            break;
          }
        }
        if (!bool) doc.inprogress[i].lessons.push(lesson_id);
        break;
      }
    }

    await doc.save();
    doc.password = undefined;
    return successfulRes(res, 201, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
