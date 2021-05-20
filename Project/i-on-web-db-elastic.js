'use strict'

const error = require('./covida-errors.js');
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

	const getUser = async function (username) { /// Obtain user given the username
		try {
			const answer = await fetchRequest(`${usersBaseUrl}/_doc/${username}`, 200);
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

	const createUser = async function (username) { /// Saving a new user in the database
		try {

			await fetchRequest(`${usersBaseUrl}/_doc/${username}`, 404); /// Verify if the username doesn't already exists in the database

			const options = {
				method: 'PUT', 
				headers: { "Content-Type": contentType },
				body: JSON.stringify({'username': username, 'selectedCoursesAndClasses': {}})
			};
			await fetchRequest(`${usersBaseUrl}/_doc/${username}`, 201, options);

		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const storeUserCourses = async function (username, courses) {
		try {
			// TO DO
		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const storeUserClasses = async function(username, classes) { 
		try {
			// TO DO
		} catch (err) {
			switch (err) {
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const deleteClass = async function(username, courseClass) {
		try {
			// TO DO
		} catch (err) {
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error and others..
					throw error.SERVICE_FAILURE;
			}
		}
	};

	return {
		initializeDatabaseIndexes : initializeDatabaseIndexes,
		getUser : getUser,
		createUser : createUser,
		storeUserCourses : storeUserCourses,
		storeUserClasses : storeUserClasses,
		deleteClass : deleteClass
	};
}

/******* Helper function *******/
const fetchRequest = async function(path, expectedStatusCode, options) {
	const response = await fetch(path, options);
	if(response.status != expectedStatusCode) throw response.status;
	return response.json();
};