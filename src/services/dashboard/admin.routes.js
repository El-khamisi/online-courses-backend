const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { isAdmin } = require('../../middelwares/authZ');
const {imageUpload, videoUpload} = require('../../config/multer');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../user/user.controllers');
const { addCourse, updateCourse, deleteCourse } = require('../course/course.controllers');
const { addLesson, updateLesson, deleteLesson } = require('../lesson/lesson.controllers');
const {addQuiz, updateQuiz, deleteQuiz} = require('../quiz/quiz.controllers')

//Users
router.get('/users', authN, isAdmin, getUsers);
router.get('/user/:id', authN, isAdmin, getUser);
router.post('/user', authN, isAdmin, imageUpload.single('photo'), addUser);
router.put('/user/:id', authN, isAdmin, imageUpload.single('photo'), updateUser);
router.delete('/user/:id', authN, isAdmin, deleteUser);

//Courses
router.post('/course', authN, isAdmin, imageUpload.single('photo'), addCourse);
router.put('/course/:id', authN, isAdmin, imageUpload.single('photo'), updateCourse);
router.delete('/course/:id', authN, isAdmin, deleteCourse);

//Lessons
router.post('/lesson/:course_id', authN, isAdmin, videoUpload.single('video'),addLesson);
router.put('/lesson/:course_id/:id', authN, isAdmin, videoUpload.single('video'), updateLesson);
router.delete('/lesson/:course_id/:id', authN, isAdmin, deleteLesson);

//Quizzes
router.post('/quiz/:course_id', authN, isAdmin, addQuiz);
router.put('/quiz/:course_id/:id', authN, isAdmin, updateQuiz);
router.delete('/quiz/:course_id/:id', authN, isAdmin, deleteQuiz);
module.exports = router;
