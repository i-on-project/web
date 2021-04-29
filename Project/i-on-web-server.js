'use strict'

/// Port definition
const port = process.env.PORT || 8080;

const express = require('express');
const app = express();

console.log("Operation mode: " + process.env.OPERATION_MODE);
console.log("Core url: " + process.env.CORE_URL);
console.log("Read token: " + process.env.CORE_READ_TOKEN);

/***** Run configurations *****/ 

/// Data
const dataModule = process.env.OPERATION_MODE == "dev"? './mock-data.js' : './core-data.js';
const data = require(dataModule)();

/// Services
const service = require('./i-on-web-services.js')(data);

/// WebUI
const webui = require('./i-on-web-ui.js')(service);

/// Middleware
app.use(webui);
app.use('/dependecies', express.static('node_modules'));
app.use('/public', express.static('static-files'));
app.set('view engine', 'hbs') /// Setting the template engine to use (hbs)

app.listen(port);
console.log("i-on Web server listening on port: " + port);
