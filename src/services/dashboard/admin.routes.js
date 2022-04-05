const router = require('express').Router();

const {authN} = require('../../middelwares/authN');
const {isAdmin} = require('../../middelwares/authZ');
const {getUsers, getUser, addUser, updateUser, deleteUser} = require('../user/user.controllers');
const {addCourse, updateCourse, deleteCourse} = require('../course/course.controllers');
const {addLesson, updateLesson, deleteLesson} = require('../lesson/lesson.controllers');

//Users
router.get('/users', authN, isAdmin, getUsers);
router.get('/user/:id', authN, isAdmin, getUser);
router.post('/user', authN, isAdmin, addUser);
router.put('/user/:id', authN, isAdmin, updateUser);
router.delete('/user/:id', authN, isAdmin, deleteUser);


//Courses
router.post('/course', authN, isAdmin, addCourse);
router.put('/course/:id', authN, isAdmin, updateCourse);
router.delete('/course/:id', authN, isAdmin, deleteCourse);

//Lessons
router.post('/lesson/:courseID', authN, isAdmin, addLesson);
router.put('/lesson/:id', authN,isAdmin, updateLesson);
router.delete('/lesson/:id', authN,isAdmin, deleteLesson);

module.exports = router;