const router = require('express').Router();

const authN = require('../../middelwares/authN');
const { getCourses, getCourse, addCourse, deleteCourse, updateCourse } = require('./course.controllers');

router.get('/courses', authN, getCourses);
router.get('/course/:id', authN, getCourse);
router.post('/course', authN, addCourse);
router.put('/course/:id', authN, updateCourse);
router.delete('/course/:id', authN, deleteCourse);

module.exports = router;
