const listagemFindModel = require('models').listagens.find;
const moment = require('moment');

module.exports = {
  /* getAvailables: getAvailables,
  getOptions: getOptions, */
  getXLSX: getXLSX
};
/* 
function getAvailables (callback) {
  listagemFindModel.getAvailables((err, rows) => {
    if (err) return callback(err);
    const availables = rows.map((e) => {
      return {
        label: e.label,
        value: e.value
      };
    });
    callback(null, availables);
  });
}

function getOptions (id, callback) {
  listagemFindModel.getOptions(id, (err, rows) => {
    if (err) return callback(err);
    const options = adjustOptions(rows);
    callback(null, options);
  });
}

function adjustOptions (arr) {
  const options = arr.map((e) => {
    const tabela = e.tabela ? e.tabela.split('|') : null;
    const imagem = e.imagem ? e.imagem.split('|') : null;
    const outputs = !e.colunas_output ? null : e.colunas_output.split('|');
    const setOutputs = {};
    const outputsLabel = {};
    for (let i in outputs) {
      setOutputs[outputs[i]] = false;
      outputsLabel[outputs[i]] = outputs[i];
    }
    return {
      maquina: e.maquina,
      imagem: !e.imagem ? null : imagem.map((el, index) => { return {label: el, values: tabela[index]}; }),
      campoPesquisa: e.listagem.split('|').map((el) => { return { label: el, value: el }; }),
      outputs: setOutputs,
      outputsLabel: outputsLabel,
      tabela: e.tabela ? e.tabela.split('|') : null,
      available: e.available
    };
  });
  return options;
} */

function getXLSX (data, user, callback) {
  listagemFindModel.getXLS(data, user, (err, rows) => {
    const filename = `./public/excelFiles/Extração_listagem_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
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
