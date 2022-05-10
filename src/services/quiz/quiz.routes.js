const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { getQuiz, getQuizzes } = require('./quiz.controllers');

router.get('/quizzes', authN, getQuizzes);
router.get('/quiz/:id', authN, getQuiz);

module.exports = router;
