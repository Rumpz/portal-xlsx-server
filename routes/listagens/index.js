const express = require('express');
const router = express.Router();
/* const multer = require('multer');
const upload = multer(); */

const { getXLSX } = require('controllers').listagens;

/* router.get('/getAvailables', getAvailables);
router.get('/getOptions', getOptions);
router.post('/upload', upload.none(), uploadFile); */
router.get('/exportXLS', getXLSX);

module.exports = router;
