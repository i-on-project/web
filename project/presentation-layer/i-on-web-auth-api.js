'use strict'

const express = require('express');
const internalErrors = require('../common/i-on-web-errors.js');

function webapi(auth) {
	
	const theWebAPI = {

		submitInstitutionalEmail: async function(req, res) {
			const body = req.body;
			try {
				const data = await auth.submitInstitutionalEmail(body.email);
				res.json(data);
			} catch(err) {
                onErrorResponse(res, err, 'Failed to submit email');
			}
		},

		pollingCore: async function(req, res) {
            const body = req.body;
			try {
				const isCompleted = await auth.pollingCore(req, body.auth_req_id);
                
				if(isCompleted) {
					res.json();
				} else res.status(202).json();

			} catch(err) {
                onErrorResponse(res, err, 'Failed to authenticate user');
			}
		}

    }

	const router = express.Router();
	router.use(express.json());	        /// Middleware to to create body property in request

	/******* Mapping requests to handlers according to the path *******/
	router.post('/email', 	theWebAPI.submitInstitutionalEmail	);	/// ...
	router.post('/poll',	theWebAPI.pollingCore				);	/// ...

	return router;
}


/******* Helper functions *******/

function onErrorResponse(res, err, defaultError) {

	switch (err) {

		case internalErrors.BAD_REQUEST:
			res.status(400).json({ cause: 'Bad Request' });
			break;
		case internalErrors.SERVICE_UNAVAILABLE:
			res.status(502).json({ cause: 'Service Unavailable' });
			break;
		default:
			res.status(500).json({ cause: defaultError});
			break;

	}

}

module.exports = webapi;

