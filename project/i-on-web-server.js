'use strict'

/// Port definition
const port = process.env.PORT || 8080;

/// Express framework
const express = require('express');
const app = express();

async function configurations() {
    console.log('port: ' + port + '\n' +
    'OPERATION_MODE: ' + process.env.OPERATION_MODE + '\n' +
    'CORE_URL: ' + process.env.CORE_URL + '\n' +
    'CORE_READ_TOKEN: ' + process.env.CORE_READ_TOKEN + '\n' +
    'CORE_CLIENT_ID: ' + process.env.CORE_CLIENT_ID + '\n' +
    'DB_ELASTIC_URL: ' + process.env.DB_ELASTIC_URL + '\n' +
    'PATH_PREFIX: ' + process.env.PATH_PREFIX + '\n'
    )
    
    /// envs
    const pathPrefix = process.env.PATH_PREFIX;

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
    app.use(`${process.env.PATH_PREFIX}/auth-api`, webAuthApi);
    app.use(`${process.env.PATH_PREFIX}`, webUI);

    console.log('s'+`${pathPrefix}/node_modules`)
    console.log('s'+`${pathPrefix}/static-files`)
    app.use('/dependecies', express.static(`${pathPrefix}/node_modules`));
    app.use('/public',      express.static(`${pathPrefix}/static-files`));
    
    app.set('view engine', 'hbs') /// Setting the template engine to use (hbs)

    app.listen(port);
    console.log("i-on Web server listening on port: " + port);

};

setTimeout(configurations , 1000); /// 60 secs - Improve this 
//configurations();
