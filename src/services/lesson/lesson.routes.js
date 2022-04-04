const router = require('express').Router();

const authN = require('../../middelwares/authN');
const {getLessons, getLesson, addLesson, updateLesson, deleteLesson} = require('./lesson.controllers');

router.get('/lessons', authN, getLessons);
router.get('/lesson/:id', authN, getLesson);
router.post('/lesson/:courseID', authN, addLesson);
router.put('/lesson/:id', authN, updateLesson);
router.delete('/lesson/:id', authN, deleteLesson);

module.exports = router;
