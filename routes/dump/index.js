const express = require('express');
const router = express.Router();

router.use('/columns', require('./columns'));
router.use('/procedure', require('./procedure'));

module.exports = router;
