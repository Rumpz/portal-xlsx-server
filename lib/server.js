/* const REQUESTTIMEOUT = 1000 * 60 * 5; */
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../'));
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const server = require('http').createServer(app);

module.exports = () => {
  // set up our express application
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev')); // log every request to the console
  }

  app.use(cors());

  // ------------------------------------------> app.use(json2xls.middleware);
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.set('view engine', 'ejs'); // set up ejs for templating
  app.use(express.static('public'));

  // routes ======================================================================
  require('config/routes.js')(app); // load our routes and pass in our app and fully configured passport

  return server;
};
