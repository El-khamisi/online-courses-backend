const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { isAdmin } = require('../../middelwares/authZ');
const { imageUpload } = require('../../config/multer');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../user/user.controllers');
const { addCourse, updateCourse, deleteCourse } = require('../course/course.controllers');
const { addLesson, updateLesson, deleteLesson } = require('../lesson/lesson.controllers');
const { addQuiz, updateQuiz, deleteQuiz } = require('../quiz/quiz.controllers');
const { addReading, updateReading, deleteReading } = require('../reading/reading.controllers');

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
router.post('/lesson/:course_id', authN, isAdmin, addLesson);
router.put('/lesson/:id/course/:course_id', authN, isAdmin, updateLesson);
router.delete('/lesson/:id/course/:course_id', authN, isAdmin, deleteLesson);

//Quizzes
router.post('/quiz', addQuiz);
router.put('/quiz/:id', authN, isAdmin, updateQuiz);
router.delete('/quiz/:id', authN, isAdmin, deleteQuiz);

//Reading
router.post('/read', authN, isAdmin, addReading);
router.put('/read/:id', authN, isAdmin, updateReading);
router.delete('/read/:id', authN, isAdmin, deleteReading);

module.exports = router;
