const Course = require('../course/course.model');
const Lesson = require('./lesson.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { premiumPlan } = require('../../config/membership');
const { Instructor } = require('../../config/roles');
const User = require('../user/user.model');

/*
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
*/

exports.getLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const lesson_id = req.params.lesson_id;
    const _id = res.locals.user.id;

    let user = await User.findById(_id).exec();
    user = await user.populate('completed');
    user = await user.populate('inprogress');

    const course = await Course.findById(course_id).exec();
    let doc;
    if (course.membership == premiumPlan && course.instructor != user._id) {
    
      if (user.completed.includes(course_id)) {
        doc = await Lesson.findById(lesson_id).exec();
      } 
      if(!doc){
        for (let i = 0; i < user.inprogress.length; i++) {
          if (user.inprogress[i].course == course_id) {
            doc = await Lesson.findById(lesson_id).exec();
            break;
          }
        }
      }
      if(!doc){
        throw new Error('You are not allowed to view this lesson');
      }
    } else {
      doc = await Lesson.findById(lesson_id).exec();
    }
    return successfulRes (res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const { data } = req.body;

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);

    let response = [];
    data.forEach(async (e) => {
      const saved = new Lesson({
        name: e.name,
        video: e.youtube_url,
        course: course_id,
      });
      response.push(saved);
      await saved.save();
      course.lessons.push(saved._id);
    });

    await course.save();
    return successfulRes(res, 201, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const _id = req.params.id;
    const { name, video } = req.body;

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
