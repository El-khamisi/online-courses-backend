const router = require('express').Router();

const authN = require('../../middelwares/authN');
const {  } = require('./course.controllers');

router.get('/lessons', authN, getCourses);
router.get('/lesson/:id', authN, getCourse);
router.post('/lesson/:courseID', authN, addCourse);
router.put('/lesson/:id', authN, updateCourse);
router.delete('/lesson/:id', authN, deleteCourse);

module.exports = router;
