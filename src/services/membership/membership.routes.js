const membership = require('../../config/membership');

const router = require('express').Router();

router.get('/membership', (req, res) => {
  res.json(Object.values(membership));
});

module.exports = router;
