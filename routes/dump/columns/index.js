const express = require('express');
const router = express.Router();

// const { isLoggedIn } = require('middlewares');
const { columnsByID, getOptions, exportXLS } = require('controllers').dump.columns;

router.get('/options', getOptions);
router.get('/columnsByID', columnsByID);
router.get('/exportXLS', exportXLS);

module.exports = router;
