const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { getLesson, getLessons } = require('./lesson.controllers');

router.get('/lessons/:course_id', authN, getLessons);
router.get('/lesson/:id/course/:course_id', authN, getLesson);

module.exports = router;
