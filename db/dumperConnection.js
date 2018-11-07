const mysql = require('mysql');
const ENV = process.env.NODE_ENV || 'dev';
const connectionError = {'code': 100, 'status': 'Error in connection database'};

// DB configs
const fiaConfig = require(`./fia`);
const portalDimConfig = require('./portalDimc.json');

// Pool configs
const fiaPool = mysql.createPool(fiaConfig);
const dimcPool = mysql.createPool(portalDimConfig);

module.exports = (database, sql, values, callback) => {
  let pools = {
    WSTPVFIA001: fiaPool,
    SVLGOIPFE05: dimcPool
  };

  /* database = process.env.NODE_ENV
    ? 'portal_test'
    : database;
  */

  if (typeof values === 'function') {
    callback = values;
    values = [];
  }
  pools[database].getConnection(function (err, connection) {
    if (err) return callback(connectionError);
    console.log('connected as id ' + connection.threadId);

    /* if (database !== 'noDB') {
      connection.query(`USE ${database}`, (err) => {
        if (err) return callback(err);
      });
    } */

    let query = connection.query(sql, values, (err, rows) => {
      connection.release();
      if (err) return callback(err);
      callback(null, rows);
    });
    console.log(query.sql);
    // if (process.env.DBlOGS);
  });
};
