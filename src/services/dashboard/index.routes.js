const router = require('express').Router();
const { verify } = require('../user/user.controllers');
const { authN } = require('../../middelwares/authN');

const admin = require('./admin.routes');
router.use('/admin', admin);
router.get('/verify', authN, verify);

module.exports = router;
