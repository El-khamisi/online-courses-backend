const router = require('express').Router();

const { getPlans, editPlans } = require('./plans.controller');

router.get('/plans', getPlans);
router.put('/plans', editPlans);

module.exports = router;
