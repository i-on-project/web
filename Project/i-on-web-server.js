'use strict'

/// Port definition
const port = process.env.PORT || 8080;

const express = require('express');
const app = express();

/***** Run configurations *****/ 

async function configuration() {

    /// Database
    const storageCreator = require('./i-on-web-db-elastic.js');
    const database = storageCreator('http://localhost:9200'); // TO DO - Make it generic
    await database.initializeDatabaseIndexes();               /// Initialize elastic indexes
 
    /// Data
    //const dataModule = process.env.OPERATION_MODE == "standalone" ? './mock-data.js' : './core-data.js';

    let data;

    if(process.env.OPERATION_MODE === "standalone") {
        data = require('./mock-data.js')();
    } else {
        const core = require('./core-data.js')();
        /// Decorators
        const coreTransformer = require('./core-data-transformer.js')(core);
        const addMissingData = require('./add-missing-data.js')(coreTransformer);
        //data = require('./i-on-web-cache.js')(addMissingData);
        data = require('./add-missing-data.js')(addMissingData); 
    }

    /// Auth
    const auth = require('./i-on-web-auth.js')(app, data, database);

    /// Services
    const service = require('./i-on-web-services.js')(data, database);

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

};

configuration();
