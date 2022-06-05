const router = require('express').Router();
const { logUser, regUser, logout, resetPassword } = require('./login.controller');
const {authN} = require('../../middelwares/authN');

router.post('/login', logUser);
router.post('/signup', regUser);
router.post('/reset-password', authN, resetPassword);
router.post('/logout', logout);

module.exports = router;
