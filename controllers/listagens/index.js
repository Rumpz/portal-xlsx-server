const FINDCONTROLLER = require('./find');
const INSERTCONTROLLER = require('./insert');
const DELETECONTROLLER = require('./delete');

module.exports = {
/*   getAvailables: getAvailables,
  uploadFile: uploadFile,
  getOptions: getOptions, */
  getXLSX: getXLSX
};

/* function getAvailables (req, res, next) {
  FINDCONTROLLER.getAvailables((err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json('Not Found');
    res.status(200).json(rows);
  });
}

function uploadFile (req, res, next) {
  const user = 'teste'; // req.user
  DELETECONTROLLER.byUser(user, (err, rows) => {
    if (err) return res.status(500).json(err);
    const fileData = Object.keys(req.body)[0].split(/\r?\n/);
    const result = fileData.filter(e => e !== '');
    INSERTCONTROLLER.addList(result, user, (err, info) => {
      if (err) return res.status(500).json(err);
      if (!rows) return res.status(404).json('Not Found');
      res.status(200).json(info);
    });
  });
}

function getOptions (req, res, next) {
  const { id } = req.query;
  FINDCONTROLLER.getOptions(id, (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json('Not Found');
    res.status(200).json(rows);
  });
} */

function getXLSX (req, res, next) {
  // Set req timeout to 20 min in case of a massive file request
  req.setTimeout(1200000);
  const user = 'teste'; // req.user
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
