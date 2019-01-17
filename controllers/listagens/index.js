const FINDCONTROLLER = require('./find');

module.exports = {
  getXLSX: getXLSX
};

function getXLSX (req, res, next) {
  // Set req timeout to 20 min in case of a massive file request
  req.setTimeout(1200000);
  const { user } = req.query;
  FINDCONTROLLER.getXLSX(req.query, user, (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json('Not Found');
    res.download(rows, (err) => {
      if (err) return err;
      deleteFile(rows);
    });
  });
}

function deleteFile (file) {
  const fs = require('fs');
  fs.unlink(`${file}`, (err) => {
    if (err) {
      return err;
    } else {
      return console.log(`Successfully deleted FILE ${file}`);
    }
  });
}
