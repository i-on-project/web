'use strict'

/// Port definition
const port = process.env.PORT || 8080;

/// Express framework
const express = require('express');
const app = express();

/// Cache
const Cache = require('./cache/cache.js');
const myCache = new Cache(0); /// Change

async function configurations() {

    /// Paths
    const presentationLayerPath  = './presentation-layer';
    const businessLogicLayerPath = './business-logic-layer';
    const dataAccessLayerPath    = './data-access-layer';

    const coreDecoratorsPath     = `${dataAccessLayerPath}/core-decorators`

    const pathPrefix = process.env.PATH_PREFIX || ""; /// TO DO can be simplified
   // if(!pathPrefix) pathPrefix = "";

    /// ElasticSearch initializer
    const storageCreator = require(`${dataAccessLayerPath}/i-on-web-db-elastic.js`);
    const sessionDB = storageCreator(process.env.DB_ELASTIC_URL);
    await sessionDB.initializeDatabaseIndexes();    /// Initialize elastic indexes
    sessionDB.deleteOldSessionsScheduler();

    /// Data
    let data;

    if(process.env.OPERATION_MODE === "standalone") {

       data = require(`${dataAccessLayerPath}/mock-data.js`)();

    } else {

        const core = require(`${dataAccessLayerPath}/core-data.js`)();

        /// Decorators
        const coreTransformer = require(`${coreDecoratorsPath}/core-data-transformer.js`)(core);
        const addMissingData  = require(`${coreDecoratorsPath}/core-add-missing-data.js`)(coreTransformer);
        const cache = require('./cache/i-on-web-cache.js')(addMissingData, myCache);
        const metadata = require(`${businessLogicLayerPath}/remove-metadata.js`)(cache);
        
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

    router.use('/public', express.static('static-files'));
    
    app.use(`${pathPrefix}`, router);

    /*
        Since the main router positions our routes above the middleware defined below,
        this means that Express will attempt to match & call routes before continuing on,
        at which point we assume it's a 404 because no route has handled the request.
    */

    app.use(function(req, res) {
        res.status(404);
        res.render('errorPage', { status: 404, errorMessage: 'Not Found' });
    });
    
    app.set('view engine', 'hbs') /// Setting the template engine to use (hbs)

    app.listen(port);
    console.log("i-on Web server listening on port: " + port);

};

const timeToRetry = 60000;
const retryInterval = 5000;
let timePassed = 0;
const myInterval = setInterval(async () => {
    if(timePassed < timeToRetry) {
        timePassed = timePassed + retryInterval;
        try {
            await configurations();
            clearInterval(myInterval);
        } catch(err) {
            console.log('Executing initial configurations..')
        }
    }
}, retryInterval);

