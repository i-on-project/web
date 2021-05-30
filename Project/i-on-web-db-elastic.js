'use strict'

const error = require('./i-on-web-errors.js');
const fetch = require('node-fetch');

const contentType = 'application/json';

module.exports = function(baseUrl) {

	const usersBaseUrl = `${baseUrl}/users`;

	const initializeDatabaseIndexes = async function () { /// Initialize index 'users' in database
		try {
			
			const getResponseUsers = await fetch(`${usersBaseUrl}/`); /// GET request to verify the existence of 'users' index
			if(getResponseUsers.status != 200 && getResponseUsers.status != 404) throw getResponseUsers.status;

			if(getResponseUsers.status == 404) { /// If the index doesn't exist than it shall be created
				const putResponseUsers = await fetch(`${usersBaseUrl}/`, { method: 'PUT'});
				if(putResponseUsers.status != 200 && putResponseUsers.status != 201) throw putResponseUsers.status;
			}

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};


	const getUser = async function (email) { /// Obtain user given the email
		try {

			const answer = await fetchRequest(`${usersBaseUrl}/_doc/${email}`, 200);
			return answer._source;

		} catch (err) {
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const createUser = async function (email, auth_req_id) { /// Saving a new user in the database
		try {

			await fetchRequest(`${usersBaseUrl}/_doc/${email}`, 404); /// Verify if the username doesn't already exists in the database
			// TO DO - Try and use a elasticsearch script in order to avoid the previous request

			const options = {
				method: 'PUT', 
				headers: { "Content-Type": contentType },
				body: JSON.stringify({'email': email, 'auth_req_id': auth_req_id, 'username': email.slice(0, email.indexOf("@"))})
			};
			await fetchRequest(`${usersBaseUrl}/_doc/${email}`, 201, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const saveUserTokens = async function (email, auth_req_id, tokens) { 
		try {
			const options = {
				method: 'PUT',
				headers: { "Content-Type": contentType },
				body: JSON.stringify(Object.assign({'email': email, 'auth_req_id': auth_req_id, 'username': email.slice(0, email.indexOf("@"))}, tokens))
			};
			await fetchRequest(`${usersBaseUrl}/_doc/${email}/`, 200, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	return {
		initializeDatabaseIndexes : initializeDatabaseIndexes,
		getUser : getUser,
		createUser : createUser,
		saveUserTokens : saveUserTokens
	};
}


/******* Helper functions *******/

const fetchRequest = async function(path, expectedStatusCode, options) {
	const response = await fetch(path, options);
	if(response.status != expectedStatusCode) throw response.status;
	return response.json();
};
