// const listagemFindModel = require('models').listagens.find;
const listagemInsertModel = require('models').listagens.insert;

function addList (data, user, callback) {
  const batchLimit = 100000;
  let batchRows = [];
  let counter = 0;
  let end = 1;
  data.forEach((el, index) => {
    if (counter > batchLimit) {
      console.log('insert batch');
      listagemInsertModel.addList(batchRows, user, (err, rows) => {
        if (err) return callback(err);
      });
      batchRows = [];
      counter = 0;
    }
    if (end === data.length) {
      listagemInsertModel.addList(batchRows, user, (err, rows) => {
        if (err) return callback(err);
        callback(null, rows.affectedRows);
      });
    }
    counter++;
    end++;
    batchRows.push([el, user]);
  });
}

module.exports = {
  addList: addList
};
