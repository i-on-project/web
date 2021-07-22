'use strict'

const internalErrors = require('../../common/i-on-web-errors.js');
const fetch = require('node-fetch');

const contentType = 'application/json';

/// Sessions expiration time
const sessionsDeletionPeriod = 7 * 24 * 60 * 60 * 1000; 

module.exports = function(baseUrl) {

	const usersBaseUrl = `${baseUrl}/sessions`;

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

		} catch (err) { // Unexpected error
			throw internalErrors.SERVICE_FAILURE;
		}
	};

	const deleteOldSessionsScheduler = async function () {
		setInterval( async () => {

			const now = Date.now();
			
			try {
				const options = {
					method: 'POST', 
					headers: { "Content-Type": contentType },
					body: JSON.stringify(
						{
							"query": {
								"range" : {
									"lastRefresh": {
										"lte": now - sessionsDeletionPeriod
									}
								}
							}
						}
					)
				};
				
				const res = await fetchRequest(`${usersBaseUrl}/_delete_by_query`, 200, options);
			
			} catch (err) { // Unexpected error
				throw internalErrors.SERVICE_FAILURE;
			}

		}, sessionsDeletionPeriod);

	};

	const createUserSession = async function (email, tokens) { /// Saving a new user in the database
		try {

			const options = {
				method: 'POST', 
				headers: { "Content-Type": contentType },
				body: JSON.stringify(
					Object.assign(
						{
							"email": email,
							"lastRefresh": Date.now()
						},
						tokens	
					)
				)
			};

			const res = await fetchRequest(`${usersBaseUrl}/_doc/`, 201, options);
			return res['_id'];

		} catch (err) { // Unexpected error
			throw internalErrors.SERVICE_FAILURE;
		}
	};

	/**
	 * Store user's session tokens
	 * @param {*} email user email
	 * @param {*} tokens user session tokens
	 */
	const storeUpdatedInfo = async function (email, tokens, doc_id) {
		try {

			const options = {
				method: 'PUT',
				headers: { "Content-Type": contentType },
				body: JSON.stringify({
						"email" : email,
						"lastRefresh" : Date.now(),
						"access_token" : tokens.access_token,
						"token_type" : tokens.token_type,
						"refresh_token" : tokens.refresh_token,
						"expires_in" : tokens.expires_in,
						"id_token" : tokens.id_token
				  })
			};

			await fetchRequest(`${usersBaseUrl}/_doc/${doc_id}/`, 200, options);

		} catch (err) { // Unexpected error
			throw internalErrors.SERVICE_FAILURE;
		}
	};

	/**
	 * Get user's tokens
	 * @param {*} email user email
	 * @returns An object with the user tokens
	 */
	const getUserTokens = async function (id) { /// Obtain user given the id
		try {

			const answer = await fetchRequest(`${usersBaseUrl}/_doc/${id}`, 200);
			return answer._source;

		} catch (err) { // Unexpected error
			throw internalErrors.UNAUTHENTICATED;
		}
	};

	const deleteUserSession = async function (id) {
		try {
			await fetchRequest(`${usersBaseUrl}/_doc/${id}`, 200, {method: 'DELETE'});

		} catch (err) {
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error and others..
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const deleteAllUserSessions = async function (email) {
		try {
			const options = {
				method: 'POST', 
				headers: { "Content-Type": contentType },
				body: JSON.stringify(
					{
						"query": {
							"bool" : {
								"should" : [
									{
										"match_phrase": {
											"email" : email
										}
									}
								]
							}
						}
					}
				)
			};
			
			await fetchRequest(`${usersBaseUrl}/_delete_by_query`, 200, options);
		
		} catch (err) { // Unexpected error
			throw internalErrors.SERVICE_FAILURE;
		}
	};

	return {
		initializeDatabaseIndexes : initializeDatabaseIndexes,
		storeUpdatedInfo : storeUpdatedInfo,
		createUserSession : createUserSession,
		getUserTokens : getUserTokens,
		deleteUserSession : deleteUserSession,
		deleteAllUserSessions : deleteAllUserSessions,
		deleteOldSessionsScheduler : deleteOldSessionsScheduler
	};
}


/******* Helper functions *******/

const fetchRequest = async function(path, expectedStatusCode, options) {
	const response = await fetch(path, options);
	if(response.status != expectedStatusCode) throw response.status;
	return response.json();
};
