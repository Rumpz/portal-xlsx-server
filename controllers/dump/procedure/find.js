const dumpProcedureFindModel = require('models').dump.procedure.find;
const moment = require('moment');

function byProcedure (data, callback) {
  dumpProcedureFindModel.exportData(data, (err, rows) => {
    const filename = `./public/excelFiles/Extração_Procedimento.xlsx`;
    if (err) return callback(err);
    if (!rows.length) return callback(null, rows);
    // remove OkPacket info from array
    rows.pop(rows[rows.length - 1]);
    // get Sheets Name // DATA for workbook
    const adjustedData = dataFormater(rows);
    getProcedure(adjustedData, filename, callback);
  });
}

function getProcedure (adjustedData, filename, callback) {
  console.log('Started Procedure method');
  const Excel = require('exceljs');
  const workbook = new Excel.stream.xlsx.WorkbookWriter({filename: filename});
  let worksheet;
  let col = [];

  // Set workbook sheets
  for (let i in adjustedData.sheets) {
    worksheet = workbook.addWorksheet(adjustedData.sheets[i]);
  }
  // iterate columns and each element of columns arrays
  for (let i in adjustedData.columns) {
    for (let j in adjustedData.columns[i]) {
      // Get elements from columns array to worksheet
      col.push({ header: adjustedData.columns[i][j], key: adjustedData.columns[i][j] });
    }
    // Set workbook columns on sheet[i] and reset col for next iteration
    workbook.getWorksheet(adjustedData.sheets[i]).columns = col;
    col = [];
  }

  // for each sheet index it will add each row of the data array[i]
  for (let i in adjustedData.sheets) {
    let ws = workbook.getWorksheet(adjustedData.sheets[i]);
    for (let j in adjustedData.data[i]) {
      ws.addRow(adjustedData.data[i][j]).commit();
    }
  }
  // commit workbook and send response callback
  workbook.commit()
    .then(response => callback(null, response.stream.path))
    .catch(err => callback(err));
}

function dataFormater (arr) {
  let sheets = [];
  let columns = [];
  let dataToRender = [];
  arr.map((e, index) => {
    e[0].sheet
      ? sheets.push(e[0].sheet)
      : columns.push(Object.keys(e[0]));
    dataToRender.push(e);
  });
  dataToRender = dataToRender.map(e => e).filter(el => !el[0].sheet);
  return {sheets: sheets, columns: columns, data: dataToRender.filter(e => !e.sheet)};
}

module.exports = {
  byProcedure: byProcedure
};
