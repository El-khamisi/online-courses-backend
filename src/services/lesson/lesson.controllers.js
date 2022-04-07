const Course = require('../course/course.model');
const Lesson = require('./lesson.model');
const { filterByMembership } = require('../../utils/filterCourses');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getLessons = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const user_id = res.locals.user.id;
    const role = res.locals.user.role;
    const membership = res.locals.user.membership;

    let course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);
    course = filterByMembership(course, membership, role, user_id);
    course = await course.populate('lessons');
    const doc = course.lessons;

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const _id = req.params.id;

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);
    course_id = filterByMembership(course_id, membership, role, user_id);

    let child_id;
    course.lessons.forEach((e) => {
      if (e._id == _id) child_id = e._id;
    });

    const doc = await Lesson.findById(child_id).exec();
    course = await course.populate('quizzes');

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const { name } = req.body;
    const video = req.file?.path;

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);

    const saved = new Lesson({
      name,
      video,
      course: course_id,
    });

    await saved.save();
    course.lessons.push(saved._id);
    await course.save();
    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const _id = req.params.id;
    const { name } = req.body;
    const video = req.file?.path;

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);

    let child_id;
    course.lessons.forEach((e) => {
      if (e._id == _id) child_id = e._id;
    });

    const doc = await Lesson.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.video = video ? video : doc.video;
    doc.course = course_id ? course_id : doc.course;

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Lesson.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
