// options imports and Constants
const connection = require('db').connection;
const portalDB = 'portal_reporting';
const dumperTable = 'portal_reporting.dumper';

// Dumper connection
const dumperConn = require('db').dumperConnection;

// Exports
module.exports = {
  getAvailables: getAvailables,
  getOptions: getOptions,
  getXLS: getXLS
};

function getAvailables (callback) {
  const sql =
  `SELECT
    dumper.id as value,
    dumper.fonte as label,
    dumper.available
  FROM ${dumperTable}
  WHERE
    IFNULL(dumper.listagem, '') != '' AND
    dumper.enabled`;
  connection(portalDB, sql, callback);
}

function getOptions (id, callback) {
  const sql =
  `SELECT
    dumper.maquina,
    dumper.imagem,
    dumper.tabela,
    dumper.colunas_output,
    dumper.listagem
  FROM ${dumperTable}
  WHERE
    id = ? AND
    dumper.listagem IS NOT NULL AND
    dumper.enabled`;
  connection(portalDB, sql, id, callback);
}

function getXLS (data, user, callback) {
  const db = data.dbConnection;
  const outputs = data.selectedOutputs;
  const table = data.tabela;
  const campo = data.campoPesquisa;
  const sql =
  `SELECT ${outputs}
    FROM ${table} a
    INNER JOIN 
      portal_reporting.temp_list_holder b
        ON a.${campo} = b.field_value
    WHERE user = ?`;
  dumperConn(db, sql, user, callback);
}
