const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { imageUpload } = require('../../config/multer');
const { profileView, profileUpdate, profileDelete, enroll, sendMail } = require('./profile.controller');
const { payment, paymentcb } = require('./payment.controller');
const { submitQuiz } = require('../quiz/quiz.controllers');

//Profile
router.get('/myprofile', authN, profileView);
router.put('/myprofile', authN, imageUpload.single('photo'), profileUpdate);
router.delete('/myprofile', authN, profileDelete);

router.post('/submit-quiz/:quiz_id', authN, submitQuiz);
router.post('/enroll/:course_id', authN, enroll);
router.post('/subscribe', authN, enroll);

router.post('/contact-us', sendMail);
router.post('/pay', authN, payment);
router.post('/paycb', paymentcb);
module.exports = router;
