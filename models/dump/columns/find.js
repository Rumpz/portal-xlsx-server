// options imports and Constants
const connection = require('db').connection;
const portalDB = 'portal_reporting';
const dumperTable = 'portal_reporting.dumper';

// Dumper connection
const dumperConn = require('db').dumperConnection;

module.exports = {
  options: options,
  columnsByID: columnsByID,
  exportData: exportData
};

// Fetch options for select Field
function options (callback) {
  const sql =
  `SELECT
    dumper.fonte as 'name',
    dumper.id as 'value',
    dumper.available
  FROM ${dumperTable}`;
  connection(portalDB, sql, callback);
}

// Fetch Input / Output options based on the choosen source
function columnsByID (id, callback) {
  const sql =
  `SET SESSION group_concat_max_len = 1000000;
  SELECT
    dumper_aux_tables.input_label as 'label',
    dumper_aux_tables.input_value as 'value',
    dumper_aux_tables.input_type as 'type',
    dumper_aux_tables.search_condition,
    dumper_aux_tables.allow_list,
    dumper_aux_tables.combinations,
    dumper.colunas_output,
    dumper.filtros_datas,
    dumper.imagem,
    dumper.available,
    dumper.tabela,
    dumper.maquina
  FROM ${dumperTable}
    LEFT JOIN dumper_aux_tables ON (dumper.id = dumper_aux_tables.dumperFK)
  WHERE
    dumper.id = ?
  ORDER BY dumper_aux_tables.input_label`;
  connection(portalDB, sql, id, callback);
}

function exportData (data, callback) {
  const outputs = getOuputs(data.selectedOutputs);
  const inputs = getInputs(data.selectedInputs);
  const sql =
  `SELECT ${outputs}
  FROM ${data.searchTable}
  WHERE
    ${data.searchDateType} BETWEEN ? AND ?
    ${inputs.sql}`;
  let values = [data.startDate, data.endDate];
  for (let i in inputs.vals) {
    values.push(inputs.vals[i]);
  }
  dumperConn(data.dbConnection, sql, values, callback);
}

function getInputs (values) {
  let keys = Object.keys(values);
  let sql = '';
  let searchVals = [];
  keys.map(key => {
    if (typeof values[key] === 'string') {
      searchVals.push(values[key]);
      sql += `\n AND ${key} = ?`;
    } else {
      searchVals.push(values[key]);
      sql += `\n AND ${key} IN (?)`;
    }
  });
  return {sql: sql, vals: searchVals};
}

function getOuputs (values) {
  if (!values) {
    return '*';
  } else {
    return values.toString();
  }
}
