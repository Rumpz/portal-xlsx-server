const express = require('express');
const router = express.Router();

// const { isLoggedIn } = require('middlewares');
const { exportXLS } = require('controllers').dump.columns;

router.get('/exportXLS', exportXLS);

module.exports = router;
