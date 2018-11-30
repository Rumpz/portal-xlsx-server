// options imports and Constants
/* const connection = require('db').connection;
const portalDB = 'portal_reporting';
const dumperTable = 'portal_reporting.dumper';
 */

// Dumper connection
const dumperConn = require('db').dumperConnection;

function exportData (data, callback) {
  const sql = `CALL ${data.searchTable}(?)`;
  let values = getValues(data);
  dumperConn(data.dbConnection, sql, values, callback);
}

function getValues (vals) {
  let datesArr = vals.startDate
    ? [vals.startDate, vals.endDate]
    : null;

  let valsData = vals.startDate
    ? new Array(+vals.procedureArgs - datesArr.length).fill(null)
    : new Array(+vals.procedureArgs).fill(null);

  // parse selected inputs
  vals.selectedInputs = JSON.parse(vals.selectedInputs);

  // get Keys of inputs
  const keys = vals.selectedInputs
    ? Object.keys(vals.selectedInputs)
    : null;

  // startDate if exists
  if (vals.startDate) {
    datesArr[0] = vals.startDate;
  }

  // endDate if exists
  if (vals.endDate) {
    datesArr[1] = vals.endDate;
  }

  for (let i = 0; i < vals.procedureArgs; i++) {
    // process args index
    const argsIndex = vals.unselectedInputs.indexOf(keys[i]);
    // for each position array is filled by on each arg index position
    if (Array.isArray(vals.selectedInputs[keys[i]])) {
      valsData[argsIndex] = vals.selectedInputs[keys[i]].toString();
    } else if (!Array.isArray(vals.selectedInputs[keys[i]])) {
      valsData[argsIndex] = vals.selectedInputs[keys[i]];
    }
  }
  // Set to null empty selected inputs
  for (let i in valsData) {
    if (valsData[i] === '') {
      valsData[i] = null;
    }
  }

  // If there is dates values will be the first two args
  return vals.startDate ? [datesArr.concat(valsData)] : [valsData];
}

module.exports = {
  exportData: exportData
};
