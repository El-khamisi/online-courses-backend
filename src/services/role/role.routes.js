const roles = require('../../config/roles');

const router = require('express').Router();

router.get('/roles', (req, res) => {
  res.json(Object.values(roles));
});

module.exports = router;
