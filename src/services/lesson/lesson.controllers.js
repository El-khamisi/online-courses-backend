const Lesson = require('./lesson.model');

exports.getLessons = async (req, res) => {
  try {
    let q = req.query;
    let response;

    if (q.name) {
      response = await Lesson.find({
        name: q.name,
      }).exec();
    } else {
      response = await Lesson.find({}).exec();
    }
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getLesson = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Lesson.findById(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { name } = req.body;

    const saved = new Lesson({
      name,
      course: courseId
    });

    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, courseID } = req.body;
    const doc = await Lesson.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.course = courseID ? courseID : doc.course;
    

    await doc.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
