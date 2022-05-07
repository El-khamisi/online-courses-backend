const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { whoiam } = require('../../middelwares/authZ');
const { isPremium, isInstructor, isAdmin } = require('../../middelwares/authZ');
const { imageUpload, videoUpload } = require('../../config/multer');
const { profileView, profileUpdate, profileDelete, mycourses, enroll, learn } = require('./profile.controller');

//Profile

router.get('/myprofile', authN, profileView);
// router.post('/profile/:id/', authN, whoiam, imageUpload.single('photo'), );
router.put('/myprofile', authN, imageUpload.single('photo'), profileUpdate);
router.delete('/myprofile', authN, profileDelete);

// router.get('/mycourses', authN, )
router.post('/mycourses/:course_id', authN, enroll);
router.post('/mycourses/:course_id/lesson/:lesson_id', authN, learn);

module.exports = router;