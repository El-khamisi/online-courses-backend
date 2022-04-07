const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { getReadings, getReading } = require('./reading.controllers');

router.get('/readings', authN, getReadings);
router.get('/reading/:id', authN, getReading);

module.exports = router;
