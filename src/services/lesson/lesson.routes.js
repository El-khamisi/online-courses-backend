const router = require('express').Router();

const {authN} = require('../../middelwares/authN');
const {getLessons, getLesson, addLesson, updateLesson, deleteLesson} = require('./lesson.controllers');

// router.get('/lessons', authN, getLessons);
// router.get('/lesson/:id', authN, getLesson);


module.exports = router;
