const router = require('express').Router();

const { getPlans } = require('./plans.controller');

router.get('/plans', getPlans);

module.exports = router;
