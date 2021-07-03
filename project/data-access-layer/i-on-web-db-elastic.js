'use strict'

const internalErrors = require('../common/i-on-web-errors.js');
const fetch = require('node-fetch');

const contentType = 'application/json';

module.exports = function(baseUrl) {

	const usersBaseUrl = `${baseUrl}/users`;

	/**
	 * Initialize index 'users' in elasticsearch db
	 */
	const initializeDatabaseIndexes = async function () {
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
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	/**
	 * Updates user's session tokens
	 * @param {*} email user email
	 * @param {*} tokens user session tokens
	 */
	const updateUserTokens = async function (email, tokens) {
		try {
			const options = {
				method: 'POST',
				headers: { "Content-Type": contentType },
				body: JSON.stringify({
						"access_token" : tokens.access_token,
						"token_type" : tokens.token_type,
						"refresh_token" : tokens.refresh_token,
						"expires_in" : tokens.expires_in,
						"id_token" : tokens.id_token
				  })
			};
			await fetchRequest(`${usersBaseUrl}/_update/${email}/`, 200, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	/**
	 * Get user's tokens
	 * @param {*} email user email
	 * @returns An object with the user tokens
	 */
	const getUserTokens = async function (email) { /// Obtain user given the email
		try {

			const answer = await fetchRequest(`${usersBaseUrl}/_doc/${email}`, 200);
			return answer._source;

		} catch (err) {
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error and others..
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};


	return {
		initializeDatabaseIndexes : initializeDatabaseIndexes,
		getUserTokens : getUserTokens,
		updateUserTokens : updateUserTokens
	};
}


/******* Helper functions *******/

const fetchRequest = async function(path, expectedStatusCode, options) {
	const response = await fetch(path, options);
	if(response.status != expectedStatusCode) throw response.status;
	return response.json();
};
