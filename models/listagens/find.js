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
    dumper.filtros_datas,
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
  const outputs = data.selectedOutputs.map(e => e.replace(e, `a.${e}`));
  const table = data.tabela;
  const campo = data.campoPesquisa;
  const sql =
  `SELECT ${outputs}
    FROM ${table} a
    INNER JOIN 
      portal_reporting.temp_list_holder b
        ON a.${campo} = b.field_value
    WHERE ${checkDates(data)}
    b.username = ?`;
  dumperConn(db, sql, user, callback);
}

function checkDates (data) {
  if (!data.tipoDeData || !data.startDate || !data.endDate) {
    return '';
  } else {
    return `a.${data.tipoDeData} 
      BETWEEN '${data.startDate}' AND '${data.endDate}' AND`;
  }
}
