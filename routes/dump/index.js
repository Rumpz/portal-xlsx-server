const express = require('express');
const router = express.Router();

router.use('/columns', require('./columns'));

module.exports = router;
