const Lesson = require('../lesson/lesson.model');
const Quiz = require('./quiz.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getQuizzes = async (req, res) => {
  //deprecated
  try {
    const lesson_id = req.params.lesson_id;

    const lesson = await Lesson.findById(lesson_id).exec();
    if (!lesson) throw new Error(`Can NOT find a Lesson with ID-${lesson_id}`);

    const doc = lesson.quizzes;

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const lesson_id = req.params.lesson_id;
    const _id = req.params.id;

    const lesson = await Lesson.findById(lesson_id).exec();
    if (!lesson) throw new Error(`Can NOT find a Lesson with ID-${lesson_id}`);

    const doc = await Quiz.findById(_id).exec();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const lesson_id = req.params.lesson_id;
    const { name, choices, correct } = req.body;

    const lesson = await Lesson.findById(lesson_id).exec();
    if (!lesson) throw new Error(`Can NOT find a Lesson with ID-${lesson_id}`);

    const saved = new Quiz({
      name,
      choices,
      correct,
      lesson: lesson_id,
    });

    await saved.save();
    lesson.quizzes.push(saved._id);
    await lesson.save();
    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const lesson_id = req.params.lesson_id;
    const _id = req.params.id;
    const { name, choices, correct } = req.body;

    const lesson = await Lesson.findById(lesson_id).exec();
    if (!lesson) throw new Error(`Can NOT find a lesson with ID-${lesson_id}`);

    const doc = await Quiz.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.correct = correct ? correct : doc.correct;
    if (doc.choices) {
      for (const [objK, objV] of Object.entries(choices)) {
        doc.choices.forEach((mapV, mapK) => {
          if (objK == mapK) doc.choices.set(mapK, objV);
        });
      }
    }

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Quiz.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
