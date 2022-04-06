const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { getCourses, getCourse, addCourse, deleteCourse, updateCourse } = require('./course.controllers');

router.get('/courses', authN, getCourses);
router.get('/course/:id', authN, getCourse);

module.exports = router;
