const express = require('express');
const router = express.Router();

// const { isLoggedIn } = require('middlewares');
const { exportProcedureXLS } = require('controllers').dump.procedure;

router.get('/exportProcedureXLS', exportProcedureXLS);

module.exports = router;
