'use strict'

/// Port definition
const port = process.env.PORT || 3000;

const express = require('express');
const app = express();

/***** Run configurations *****/ 

/// Database
const storage = require('./i-on-web-storage.js')();

/// Core
const core_data = require('./core-data.js');

/// Services
const service = require('./i-on-web-services.js')(storage, core_data);

/// WebUI
const webui = require('./i-on-web-ui.js')(service);

/// Middleware
app.use(webui);

app.use('/dependecies', express.static('node_modules'));
app.use('/public', express.static('static-files'));
app.set('view engine', 'hbs') /// Setting the template engine to use (hbs)

app.listen(port);
console.log("i-on Web server listening on port: " + port);
