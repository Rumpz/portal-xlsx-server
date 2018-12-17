// options imports and Constants
const connection = require('db').connection;
const portalDB = 'portal_reporting';
const dumperTable = 'portal_reporting.dumper';

// Dumper connection
const dumperConn = require('db').dumperConnection;

// Exports
module.exports = {
  byUser: byUser
};

function byUser (user, callback) {
  const sql =
  `DELETE
    FROM temp_list_holder
  WHERE user = ?`;
  connection(portalDB, sql, user, callback);
}
