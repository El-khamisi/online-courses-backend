const router = require('express').Router();
const { imageUpload } = require('../../config/multer');
const { logUser, regUser, logout } = require('./login.controller');

router.post('/login',logUser);
router.post('/signup', regUser);
router.post('/logout', logout);

module.exports = router;
