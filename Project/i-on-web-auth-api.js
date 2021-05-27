'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');

function webapi(auth) {
	
	const theWebAPI = {

		submitEmail: async function(req, res) {
            const body = req.body; /// Extrair os parâmetros
            console.log("body: " + JSON.stringify(body));
			try {
				//const data = await auth.submitEmail(body.email);
                res.json({ 'resposta': "teste" });
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Home Page');
			}
		}

    }

	const router = express.Router();
	router.use(express.json());	        /// Middleware to to create body property in request

	/******* Mapping requests to handlers according to the path *******/

	router.post('/email', 					theWebAPI.submitEmail			);	/// Home page

	return router;
}


/******* Helper functions *******/

async function onErrorResponse(res, err, defaultError) {

	const translatedError = appErrorsToHttpErrors(err, defaultError);
	
	res.statusCode = translatedError.status;
	res.render(page, translatedError);

}

function appErrorsToHttpErrors(err, defaultError) {

	switch (err) {
		case error.BAD_REQUEST:
			return { status: 400, message: 'Bad Request' };
		case error.RESOURCE_NOT_FOUND:
			return { status: 404, message: 'Resource Not Found' };
		default:
			return { status: 500, message: `An error has occured: ${defaultError} errorPage` };
	}
}

module.exports = webapi;

