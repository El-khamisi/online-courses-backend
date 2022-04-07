const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { getQuiz, getQuizzes } = require('./quiz.controllers');

// router.get('/quizzes/:course_id', authN, getQuizzes);
router.get('/quiz/:id/lesson/:lesson_id', authN, getQuiz);

module.exports = router;
