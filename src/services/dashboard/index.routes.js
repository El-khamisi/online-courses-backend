const router = require('express').Router();

const admin = require('./admin.routes');
router.use('/admin', admin);

module.exports = router;
