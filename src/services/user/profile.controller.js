const nodemailer = require('nodemailer');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('./user.model');
const { successfulRes, failedRes } = require('../../utils/response');
const Course = require('../course/course.model');
const { premiumPlan } = require('../../config/membership');
const { upload_image } = require('../../config/cloudinary');
const { sendinblue_user, sendinblue_key, to_email } = require('../../config/env');

exports.profileView = async (req, res) => {
  try {
    const _id = res.locals.user.id;

    const response = await User.aggregate([
      {
        $match: { _id: ObjectId(_id) },
      },
      {
        $unset: ['password', 'createdAt', 'updatedAt', '__v'],
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'completed',
          foreignField: '_id',
          pipeline: [{ $project: { name: 1, price: 1, photo: 1, membership: 1, level: 1, quizzes: 1 } }, { $addFields: { quizzes: { $size: '$quizzes' } } }],
          as: 'completed',
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'inprogress.course',
          foreignField: '_id',
          pipeline: [{ $project: { description: 0, createdAt: 0, updatedAt: 0, __v: 0 } }],
          as: 'inprogress',
        },
      },
      {
        $lookup: {
          from: 'readings',
          localField: 'reads',
          foreignField: '_id',
          pipeline: [{ $project: { description: 0, createdAt: 0, updatedAt: 0, __v: 0 } }],
          as: 'reads',
        },
      },
    ]);

    return successfulRes(res, 200, response[0]);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    const _id = res.locals.user.id;
    const { first_name, last_name, email, phone, role, membership } = req.body;
    const photo = req.file?.path;

    let doc = await User.findById(_id).exec();

    if (photo) {
      doc.photo = await upload_image(photo, doc._id, 'user_thumbs');
    }
    doc.first_name = first_name ? first_name : doc.first_name;
    doc.last_name = last_name ? last_name : doc.last_name;
    doc.email = email ? email : doc.email;
    doc.phone = phone ? phone : doc.phone;

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

exports.enroll = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const user = req.session.user;

    user.completed.forEach((e) => {
      if (e == course_id) throw new Error('Your have already completed to this course');
    });
    user.inprogress.forEach((e) => {
      if (e.course == course_id) throw new Error('Your have already enrolled to this course');
    });

    const course = Course.findById(course_id).exec();
    if (course.membership == premiumPlan && course.instructor != user._id) {
      throw new Error('You should pay to enroll to premium courses');
    } else {
      const doc = await User.findByIdAndUpdate(user._id, {
        $push: { inprogress: { course: course_id, quizzes: [] } },
      }).exec();
      user.inprogress.push({ course: course_id, quizzes: [] });

      return res.redirect(`/course/${course_id}`);
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.sendMail = async (req, res) => {
  const { from, text } = req.body;

  try {
    let transport = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      // secure: false,
      auth: {
        user: sendinblue_user,
        pass: sendinblue_key,
      },
    });

    let user = 'Guest User';
    if (req.session && req.session.user) {
      user = req.session.user.last_name ? `${req.session.user.first_name} ${req.session.user.last_name}` : 'Guest User';
    }

    let info = await transport.sendMail({
      from: `${user} <${from}>`,
      to: to_email,
      subject: 'Email sent through contact us form',
      text,
      html: `<p>${text}</p>`,
    });

    return successfulRes(res, 200, { response: info.response, from: info.envelope.from, to: info.envelope.to[0] });
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
