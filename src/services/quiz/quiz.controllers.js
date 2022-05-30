const Quiz = require('./quiz.model');
const ObjectId = require('mongoose').Types.ObjectId;
const { successfulRes, failedRes } = require('../../utils/response');
const User = require('../user/user.model');

exports.getQuizzes = async (req, res) => {
  try {
    const q = req.query;

    const doc = await Quiz.find(q).sort('-createdAt').select('name');

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const _id = req.params.id;

    const doc = await Quiz.aggregate([
      {
        $match: { _id: ObjectId(_id) },
      },
      {
        $unset: ['questions.answer', 'createdAt', 'updatedAt', '__v'],
      },
    ]);

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const { name, questions } = req.body;

    const saved = new Quiz({
      name,
      questions: [],
    });
    questions?.forEach((e) => {
      const obj = {};
      e.options?.forEach((ee) => (obj[ee.value] = ee.option_name));

      saved.questions.push({
        question_name: e.question_name,
        options: obj,
        answer: e.answer.value,
      });
    });

    await saved.save();
    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, questions } = req.body;

    const doc = await Quiz.findById(_id).exec();

    doc.name = name ? name : doc.name;
    if (doc.questions) {
      questions.forEach((e) => {
        const obj = {};
        e.options.forEach((ee) => (obj[ee.value] = ee.option_name));

        doc.questions.push({
          question_name: e.question_name,
          options: obj,
          answer: e.answer.value,
        });
      });
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

exports.submitQuiz = async (req, res) => {
  const quiz_id = req.params.quiz_id;
  const { questions } = req.body;
  const user_id = res.locals.user.id;

  try {
    let doc = await Quiz.findById(quiz_id).exec();
    let docname = doc.name;
    doc = doc.questions;
    let response = { answers: [], total: 0 };

    questions.forEach((e) => {
      doc.forEach((ee) => {
        if (e._id == ee._id) {
          response.total += e.answer.toUpperCase() == ee.answer;
          response.answers.push({ _id: e._id, selected: e.answer, answer: ee.answer });
        }
      });
    });

    response.total = parseFloat(((5 / doc.length) * response.total).toFixed(1));
    const usr = await User.findById(user_id).exec();
    
    let flag = false;
    for(const obj of usr.quizzes){
      if(obj._id == quiz_id){
        obj.date =  (()=>new Date())();
        obj.score = response.total;
        flag = true;
        break;
      }
    }

    if(flag == false){
      usr.quizzes.push({
        _id: quiz_id,
        name: docname,
        date: (() => {
          const date = new Date();
          return date;
        })(),
        score: response.total,
      });

    }

    await usr.save();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
