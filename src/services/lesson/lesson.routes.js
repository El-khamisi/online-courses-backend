const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { getLesson } = require('./lesson.controllers');

router.get('/lesson/:lesson_id/course/:course_id', authN, getLesson);
router.get('/loli', (req, res)=>res.json({session: req.session.user}))
module.exports = router;
