'use strict'

const error = require('./i-on-web-errors.js');
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_authorization = 'Bearer ' + process.env.CORE_READ_TOKEN;
const write_authorization = 'Bearer ' + process.env.CORE_WRITE_TOKEN;
const core_uri = process.env.CORE_URI;

const coreRequest = async function(uri, method, expectedStatus, reqBody) {
	const response = await fetch(uri, 
		{
			method: method,
			headers: {
				'Authorization': read_authorization,
				'Content-Type': contentType
			},
			body: reqBody
		});
		
	if(response.status != expectedStatus) throw response.status;

	return response.json();
};

module.exports = function() {

	const loadAllProgrammes = async function () {
		try {
			console.log(read_authorization);
			console.log(core_uri);
			return await coreRequest(core_uri + '/v0/programmes/', 'GET', 200);
		} catch(err) {
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	}

	return {
		loadAllProgrammes : loadAllProgrammes
	};
}