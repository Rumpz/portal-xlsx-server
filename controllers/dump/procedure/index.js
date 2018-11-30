const FINDCONTROLLER = require('./find.js');

function exportProcedureXLS (req, res, next) {
  // Set req timeout to 20 min in case of a massive file request
  req.setTimeout(1200000);
  FINDCONTROLLER.byProcedure(req.query, (err, rows) => {
    if (err) return res.status(500).json(err);
    // if (!rows.length) return res.status(404).json('Not Found');
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
      return console.log(`Successfully deleted Procedure FILE ${file}`);
    }
  });
}

module.exports = {
  exportProcedureXLS: exportProcedureXLS
};
