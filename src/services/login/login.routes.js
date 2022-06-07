const router = require('express').Router();
const { logUser, regUser, logout, resetPassword } = require('./login.controller');
const { authN } = require('../../middelwares/authN');
const { emailVerification } = require('./email-verification.controller');

router.post('/login', logUser);
router.post('/signup', regUser);
router.post('/logout', logout);
router.put('/reset-password', authN, resetPassword);
router.get('/email-verification/:hash', emailVerification);

module.exports = router;
