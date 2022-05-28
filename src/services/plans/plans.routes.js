const router = require('express').Router();

const { authN } = require('../../middelwares/authN');
const { isAdmin } = require('../../middelwares/authZ');
const { getPlans, editPlans } = require('./plans.controller');

router.get('/plans', getPlans);
router.put('/plans', authN, isAdmin, editPlans);

module.exports = router;
