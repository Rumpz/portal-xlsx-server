const routes = require('../routes');

module.exports = (app) => {
  app.use('/dump', routes.dump);
};
