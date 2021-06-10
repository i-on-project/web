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

	const firstTimeUser = async function (email) {
		try {
			const response = await fetch(`${usersBaseUrl}/_doc/${email}`);
			if(response.status == 404) { return true; }
			else if(response.status == 200) { return false; }
			else { throw response.status; }

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

	const createUser = async function (email, programme, tokens) { /// Saving a new user in the database
		try {
			const options = {
				method: 'PUT', 
				headers: { "Content-Type": contentType },
				body: JSON.stringify(Object.assign(
					{
						'email': email,
					 	'username': email.slice(0, email.indexOf("@")),
						'programme': programme
					},
					tokens))
			};
			await fetchRequest(`${usersBaseUrl}/_doc/${email}`, 201, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const updateUserTokens = async function (email, tokens) {
		try {
			const options = {
				method: 'POST',
				headers: { "Content-Type": contentType },
				body: JSON.stringify({
					"script" : {
					  "source": "ctx._source.access_token = params.access_token; ctx._source.token_type = params.token_type; ctx._source.expires_in = params.expires_in; ctx._source.refresh_token = params.refresh_token; ctx._source.id_token = params.id_token",
					  "lang": "painless",
					  "params" : {
						"access_token" : tokens.access_token,
						"token_type" : tokens.token_type,
						"refresh_token" : tokens.refresh_token,
						"expires_in" : tokens.expires_in,
						"id_token" : tokens.id_token
					  }
					}
				  })
			};
			await fetchRequest(`${usersBaseUrl}/_update/${email}/`, 200, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const changeUsername = async function (email, newUsername) {
		try {
			const options = {
				method: 'POST',
				headers: { "Content-Type": contentType },
				body: JSON.stringify({
					"script" : {
					  "source": "ctx._source.username = params.newUsername",
					  "lang": "painless",
					  "params" : {
						"newUsername" : newUsername
					  }
					}
				  })
			};
			await fetchRequest(`${usersBaseUrl}/_update/${email}/`, 200, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const changeUserProgramme = async function (email, newProgramme) { 
		try {
			const options = {
				method: 'POST',
				headers: { "Content-Type": contentType },
				body: JSON.stringify({
					"script" : {
					  "source": "ctx._source.programme = params.newProgramme",
					  "lang": "painless",
					  "params" : {
						"newProgramme" : newProgramme
					  }
					}
				  })
			};
			await fetchRequest(`${usersBaseUrl}/_update/${email}/`, 200, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	return {
		initializeDatabaseIndexes : initializeDatabaseIndexes,
		firstTimeUser : firstTimeUser,
		getUser : getUser,
		createUser : createUser,
		updateUserTokens : updateUserTokens,
		changeUsername : changeUsername,
		changeUserProgramme : changeUserProgramme
	};
}


/******* Helper functions *******/

const fetchRequest = async function(path, expectedStatusCode, options) {
	const response = await fetch(path, options);
	if(response.status != expectedStatusCode) throw response.status;
	return response.json();
};
