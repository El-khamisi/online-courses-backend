const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { imageUpload } = require('../../config/multer');
const { profileView, profileUpdate, profileDelete, mycourses, enroll, learn } = require('./profile.controller');
const { payment, paymentcb } = require('./payment.controller');

//Profile

router.get('/myprofile', authN, profileView);
router.put('/myprofile', authN, imageUpload.single('photo'), profileUpdate);
router.delete('/myprofile', authN, profileDelete);

router.post('/enroll/:course_id', authN, enroll);
router.post('/learn/:course_id/lesson/:lesson_id', authN, learn);

router.all('/pay', authN, payment);
router.post('/paycb', authN, paymentcb);
module.exports = router;
