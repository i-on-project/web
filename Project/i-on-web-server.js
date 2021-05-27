'use strict'

/// Port definition
const port = process.env.PORT || 8080;

const express = require('express');
const app = express();

/***** Run configurations *****/ 

/// Data
//const dataModule = process.env.OPERATION_MODE == "standalone"? './mock-data.js' : './core-data.js';
//const data = require(dataModule)();
const data = require('./add-missing-data.js')();

/// Auth
const auth = require('./i-on-web-auth.js')(app, data);

/// Services
const service = require('./i-on-web-services.js')(data);

/// WebUI
const webUI = require('./i-on-web-ui.js')(service, auth);

/// Auth WebAPI
const webAuthApi = require('./i-on-web-auth-api')(auth);

/// Middleware
app.use('/auth-api', webAuthApi);
app.use(webUI);
app.use('/dependecies', express.static('node_modules'));
app.use('/public', express.static('static-files'));
app.set('view engine', 'hbs') /// Setting the template engine to use (hbs)

app.listen(port);
console.log("i-on Web server listening on port: " + port);
