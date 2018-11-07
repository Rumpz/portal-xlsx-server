const dumpColFindModel = require('models').dump.columns.find;
const moment = require('moment');

function options (callback) {
  dumpColFindModel.options((err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

function columnsByID (query, callback) {
  const { id } = query;
  dumpColFindModel.columnsByID(id, (err, rows) => {
    if (err) return callback(err);
    // row[0] = OkPacket
    const adjustedData = adjustData(rows[1]);
    const inputs = adjustedData.map(e => e.colunasInput);
    const renderData = {
      colunasInput: inputs,
      colunasOutput: adjustedData[0]['colunasOutput'],
      outputsLabel: adjustedData[0]['outputsLabel'],
      filtrosDatas: adjustedData[0]['filtrosDatas'],
      imagem: adjustedData[0]['imagem'],
      available: adjustedData[0]['available'],
      searchTables: adjustedData[0]['tabela'],
      dbConnection: adjustedData[0]['dbConnection']
    };
    callback(null, renderData);
  });
}

function adjustData (arr) {
  const data = arr.map((e) => {
    // OUTPUTS LABEL / OUTPUTS
    const outputs = !e['colunas_output'] ? null : e['colunas_output'].split('|');
    const setOutputs = {};
    const outputsLabel = {};

    for (let i in outputs) {
      setOutputs[outputs[i]] = false;
      outputsLabel[outputs[i]] = outputs[i];
    }
    return {
      colunasInput:
        {
          name: e.value,
          type: e.type,
          label: e.label,
          isOpen: false,
          value: null,
          options: '',
          searchCondition: e['search_condition'],
          allowList: e['allow_list'],
          combinations: !e.combinations ? null : e.combinations.split('|').map((e) => { return {label: e, value: e}; })
        },
      dbConnection: e.maquina,
      tabela: !e.tabela ? null : e.tabela.split('|'),
      colunasOutput: setOutputs,
      outputsLabel: outputsLabel,
      filtrosDatas: !e['filtros_datas'] ? null : e['filtros_datas'].split('|'),
      imagem: !e.imagem ? null : e.imagem.split('|'),
      available: !e.available ? null : e.available
    };
  });
  return data;
}

function exportXLS (data, callback) {
  data.selectedInputs = JSON.parse(data.selectedInputs);
  dumpColFindModel.exportData(data, (err, rows) => {
    const filename = `./public/excelFiles/Extração_${data.searchTable}_${moment(data.startDate).format('YYYY-MM-DD')}_a_${data.endDate}.xlsx`;
    if (err) return callback(err);
    if (!rows.length) return callback(null, rows);

    console.log('inside method');
    const Excel = require('exceljs');
    const workbook = new Excel.stream.xlsx.WorkbookWriter({filename: filename});
    const worksheet = workbook.addWorksheet('my sheet');
    const keys = Object.keys(rows[0]);
    const col = [];

    for (let i in keys) {
      col.push({ header: keys[i], key: keys[i] });
      worksheet.columns = col;
    }

    for (let i = 0; i <= rows.length; i++) {
      worksheet.addRow(rows[i]).commit();
    }
    workbook.commit()
      .then(response => callback(null, response.stream.path))
      .catch(err => callback(err));
  });
}

module.exports = {
  options: options,
  columnsByID: columnsByID,
  exportXLS: exportXLS
};
