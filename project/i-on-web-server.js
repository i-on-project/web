'use strict'

/// Port definition
const port = process.env.PORT || 8080;

/// Express framework
const express = require('express');
const app = express();

async function configurations() {

    /// Paths
    const presentationLayerPath  = './presentation-layer';
    const businessLogicLayerPath = './business-logic-layer';
    const dataAccessLayerPath    = './data-access-layer';

    const coreDecoratorsPath     = `${dataAccessLayerPath}/core-decorators`

    /// Database
    const storageCreator = require(`${dataAccessLayerPath}/i-on-web-db-elastic.js`);
    const database = storageCreator(process.env.DB_ELASTIC_URL); // TO DO
    await database.initializeDatabaseIndexes();               /// Initialize elastic indexes
 
    /// Data
    let data;

    if(process.env.OPERATION_MODE === "standalone") {
        data = require(`${dataAccessLayerPath}/mock-data.js`)();
    } else {
        const core = require(`${dataAccessLayerPath}/core-data.js`)();

        /// Decorators
        const coreTransformer = require(`${coreDecoratorsPath}/core-data-transformer.js`)(core);
        const addMissingData  = require(`${coreDecoratorsPath}/core-add-missing-data.js`)(coreTransformer);
        data = addMissingData; // require('./i-on-web-cache.js')(addMissingData); // ... add cache ...
    }

    /// Auth
    const auth = require(`${businessLogicLayerPath}/i-on-web-auth.js`)(app, data, database);

    /// Services
    const service = require(`${businessLogicLayerPath}/i-on-web-services.js`)(data, database);

    /// WebUI
    const webUI = require(`${presentationLayerPath}/i-on-web-ui.js`)(service, auth);

    /// Auth WebAPI
    const webAuthApi = require(`${presentationLayerPath}/i-on-web-auth-api`)(auth);

    /// Middlewares
    app.use('/auth-api', webAuthApi);
    app.use(webUI);

    app.use('/dependecies', express.static('/node_modules'));
    app.use('/public',      express.static('/static-files'));
    
    app.set('view engine', 'hbs') /// Setting the template engine to use (hbs)

    app.listen(port);
    console.log("i-on Web server listening on port: " + port);

};

setTimeout(configurations , 1000); /// 60 secs - Improve this 
//configurations();
