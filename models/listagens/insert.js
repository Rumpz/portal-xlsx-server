// options imports and Constants
const connection = require('db').connection;
const portalDB = 'portal_reporting';
const listTable = 'temp_list_holder';

// Dumper connection
const dumperConn = require('db').dumperConnection;

function addList (data, user, callback) {
  let sql =
  `INSERT IGNORE INTO ${listTable} (field_value, user) VALUES ?`;
  let values = [data, user];
  connection(portalDB, sql, values, callback);
}

module.exports = {
  addList: addList
};
