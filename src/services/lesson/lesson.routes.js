const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { getLesson } = require('./lesson.controllers');

router.get('/lesson/:id', authN, getLesson);

module.exports = router;
