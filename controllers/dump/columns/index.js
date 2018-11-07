const FINDCONTROLLER = require('./find');

function getOptions (req, res, next) {
  FINDCONTROLLER.options((err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json('Not Found');
    res.status(200).json(rows);
  });
}

function columnsByID (req, res, next) {
  FINDCONTROLLER.columnsByID(req.query, (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!Object.keys(rows)) return res.status(404).json('Not Found');
    res.status(200).json(rows);
  });
}

function exportXLS (req, res, next) {
  // Set req timeout to 10 min in case of a massive file request
  req.setTimeout(1200000);
  FINDCONTROLLER.exportXLS(req.query, (err, rows) => {
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
      return console.log(`Successfully deleted ${file}`);
    }
  });
}

module.exports = {
  exportXLS: exportXLS,
  getOptions: getOptions,
  columnsByID: columnsByID
};
