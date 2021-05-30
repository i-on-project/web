'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');
const crypto = require('crypto');

function webapi(auth) {
	
	const theWebAPI = {

		submitInstitutionalEmail: async function(req, res) {
            const body = req.body;
			try {
				const data = await auth.submitInstitutionalEmail(body.email);
                //res.setHeader('Set-Cookie', ['auth_req_id=' + data.auth_req_id, 'expires_in=' + data.expires_in], 'Expires=' + new Date(Date.now() + data.expires_in)); /// TO DO: confirm it, same site and other security issues, hash ou something? , 'HttpOnly'
				const hmac = crypto
					.createHmac('sha256', 'changeit') // TO DO
					.update(body.email) 
					.digest('hex');

				res.setHeader('Set-Cookie', ['Identifier=' + body.email, 'Mac=' + hmac], 'Expires=' + new Date(Date.now() + data.expires_in)); /// TO DO: confirm it, same site and other security issues, hash ou something? , 'HttpOnly'
				res.json(data);
			} catch(err) {
                console.log("erro -> " + err);
				//await onErrorResponse(res, err, 'Failed to show Home Page');
			}
		},

		pollingCore: async function(req, res) {
            const params = req.params;

			
			try {
				if(!isCookieValid(req)) throw error.SERVICE_FAILURE; // TO DO - Change
				const data = await auth.pollingCore(req, getCookies(req).Identifier, params['authId']);
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

const getCookies = (req) => {
    if(!req.headers.cookie) return null;

    const rawCookies = req.headers.cookie.split('; ');

    const parsedCookies = {}; 

    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
};

const isCookieValid = (req) => {

    const parsedCookies = getCookies(req);

    if(!parsedCookies) {
        return false;
    } else {
        const cookie1 = parsedCookies['Mac'];
        const id = parsedCookies['Identifier'];

        if(!cookie1 || !id) {
            return false;
        } else {
            const hmac = crypto.createHmac('sha256', 'changeit');
            const cookie2 = hmac.update(id).digest('hex');

            return cookie1 === cookie2;
        }
    }
};

module.exports = webapi;

