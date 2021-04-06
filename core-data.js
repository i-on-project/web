'use strict'

const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
// TO DO - Change token to environment variable
const authorization = 'Bearer l7kowOOkliu21oXxNpuCyM47u2omkysxb8lv3qEhm5U';


const coreRequest = async function(uri, method, reqBody) {
	const response = await fetch(uri, 
		{
			method: method,
			headers: {
				'Authorization': authorization,
				'Content-Type': contentType
			},
			body: reqBody
		});
		
	// TO DO - Verify response status

	return response.json();
}

module.exports = {

	loadAllProgrammes: async function () {
		try {
			// TO DO - change request uri (this is a test version) 
			return await coreRequest('http://localhost:10023/v0/programmes/', 'GET');
		} catch(err) {
			switch (err) {
				// TO DO - Handle errors
			}
		}
	}
	
}
