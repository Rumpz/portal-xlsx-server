const listagemDeleteModel = require('models').listagens.delete;

module.exports = {
  byUser: byUser
};

function byUser (id, callback) {
  listagemDeleteModel.byUser(id, (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}
