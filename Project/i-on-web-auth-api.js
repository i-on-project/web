'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');

function webapi(auth) {
	
	const theWebAPI = {

		submitInstitutionalEmail: async function(req, res) {
            const body = req.body;
            console.log("body: " + JSON.stringify(body));
			try {
				const data = await auth.submitInstitutionalEmail(body.email);
                console.log("web api data: " + JSON.stringify(data));
                //res.setHeader('Set-Cookie', ['auth_req_id=' + data.auth_req_id, 'expires_in=' + data.expires_in], 'Expires=' + new Date(Date.now() + data.expires_in)); /// TO DO: confirm it, same site and other security issues, hash ou something? , 'HttpOnly'
                res.json(data);
			} catch(err) {
                console.log("erro -> " + err);
				//await onErrorResponse(res, err, 'Failed to show Home Page');
			}
		},

		pollingCore: async function(req, res) {
            const params = req.params;

			try {
				console.log("chegou")
				const data = await auth.pollingCore(params['authId']);
                console.log("web api polling: " + JSON.stringify(data));
                if(data.polling_success) {
					res.json(data);
				} else res.status(202).json(data);
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
	router.get('/:authId/poll',		theWebAPI.pollingCore				);	///

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

