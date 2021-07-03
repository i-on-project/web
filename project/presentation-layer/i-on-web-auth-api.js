'use strict'

const express = require('express');
const internalErrors = require('../common/i-on-web-errors.js');

function webapi(auth) {
	
	const theWebAPI = {

		submitInstitutionalEmail: async function(req, res) {
			const body = req.body;
			try {
				const data = await auth.submitInstitutionalEmail(body.email);
				console.log("12121" + JSON.stringify(data));
				res.json(data);
			} catch(err) {
                console.log("erro -> " + err);
				//await onErrorResponse(res, err, 'Failed to show Home Page');
			}
		},

		pollingCore: async function(req, res) {
			console.log("entra na polling")
            const params = req.params;
			console.log("received params: "+ JSON.stringify(params))
			try {
				
				const isCompleted = await auth.pollingCore(req, params['authId']);
				console.log("-->" + isCompleted)
                if(isCompleted) {
					res.json();
				} else res.status(202).json();

			} catch(err) {
                console.log("erro -> " + err);
				//await onErrorResponse(res, err, 'Failed to show Home Page');
			}
		}

    }

	const router = express.Router();
	router.use(express.json());	        /// Middleware to to create body property in request

	/******* Mapping requests to handlers according to the path *******/
	router.post('/email', 			theWebAPI.submitInstitutionalEmail	);	///
	router.post('/:authId/poll',	theWebAPI.pollingCore				);	///

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
		case internalErrors.BAD_REQUEST:
			return { status: 400, message: 'Bad Request' };
		case internalErrors.RESOURCE_NOT_FOUND:
			return { status: 404, message: 'Resource Not Found' };
		default:
			return { status: 500, message: `An error has occured: ${defaultError} errorPage` };
	}
}

module.exports = webapi;

