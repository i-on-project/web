'use strict'

/// Port definition
const port = process.env.PORT || 8080;

/// Express framework
const express = require('express');
const app = express();

/// Cache
const Cache = require('./cache/cache.js');
const myCache = new Cache(1 * 24 * 60 * 60); /// Change

async function configurations() {

    /// Paths
    const presentationLayerPath  = './presentation-layer';
    const businessLogicLayerPath = './business-logic-layer';
    const dataAccessLayerPath    = './data-access-layer';

    const coreDecoratorsPath     = `${dataAccessLayerPath}/core-decorators`

    let pathPrefix = process.env.PATH_PREFIX; /// TO DO can be simplified
    if(!pathPrefix) pathPrefix = "";

    /// ElasticSearch initializer
    const storageCreator = require(`${dataAccessLayerPath}/i-on-web-db-elastic.js`);
    const sessionDB = storageCreator(process.env.DB_ELASTIC_URL); // TO DO
    await sessionDB.initializeDatabaseIndexes();               /// Initialize elastic indexes

    /// Data
    let data;

    if(process.env.OPERATION_MODE === "standalone") {

        data = require(`${dataAccessLayerPath}/mock-data.js`)();

    } else {

        const core = require(`${dataAccessLayerPath}/core-data.js`)();

        /// Decorators
        const coreTransformer = require(`${coreDecoratorsPath}/core-data-transformer.js`)(core);
        const addMissingData  = require(`${coreDecoratorsPath}/core-add-missing-data.js`)(coreTransformer);
        const cache = require('./i-on-web-cache.js')(addMissingData, myCache);
        const metadata = require('./i-on-web-metadata.js')(cache);
        
        data = metadata;

    }

    /// Auth
    const auth = require(`${businessLogicLayerPath}/i-on-web-auth.js`)(app, data, sessionDB);

    /// Services
    const service = require(`${businessLogicLayerPath}/i-on-web-services.js`)(data, sessionDB);

    /// WebUI
    const webUI = require(`${presentationLayerPath}/i-on-web-ui.js`)(service, auth);

    /// Auth WebAPI
    const webAuthApi = require(`${presentationLayerPath}/i-on-web-auth-api`)(auth);
  
    /// Prefix router
    const router = express.Router();

    router.use('/auth-api', webAuthApi);
    router.use(webUI);

    router.use('/dependecies', express.static('node_modules')); // TO DO todo - Remove
    router.use('/public', express.static('static-files'));

    app.use(`${pathPrefix}`, router);

    app.set('view engine', 'hbs') /// Setting the template engine to use (hbs)

    app.listen(port);
    console.log("i-on Web server listening on port: " + port);

};

setTimeout(configurations , 1000); /// 60 secs - TO DO: Improve this and index initializer
//configurations();
