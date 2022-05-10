const Quiz = require('./quiz.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getQuizzes = async (req, res) => {
  try {
    const q = req.query;

    const doc = await Quiz.find(q).sort('-createdAt');

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const _id = req.params.id;

    const doc = await Quiz.findById(_id).exec();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addQuiz = async (req, res) => {
  try {
    const { name, choices, correct } = req.body;

    const saved = new Quiz({
      name,
      choices,
      correct,
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
    const { name, choices, correct } = req.body;

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
