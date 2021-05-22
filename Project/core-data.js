'use strict'

const error = require('./i-on-web-errors.js');
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_token = 'Bearer ' + process.env.CORE_READ_TOKEN;
const core_url = process.env.CORE_URL;

const coreRequest = async function(endpoint, expectedStatus, options) {

	const response = await fetch(core_url + endpoint, options);

	if(response.status != expectedStatus) throw response.status;

	return response.json();
};

module.exports = function() {

	const loadAllProgrammes = async function () {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/v0/programmes/', 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadAllProgrammeOffers = async function (programmeId) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/v0/programmes/'+ programmeId, 200, options);	

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadProgrammeData = async function(programmeId) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/v0/programmes/'+ programmeId, 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadCourse = async function(courseId) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/v0/courses/'+ courseId +'/classes/1718i', 200, options); // TO DO - change 

		} catch (err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	}
	
	const loadAboutData = async function () {
		try {
		
			return {}; // Request still not suported by i-on Core

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadAuthenticationMethods = async function () {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
			
			return await coreRequest('/api/auth/methods', 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourse : loadCourse,
		loadAboutData : loadAboutData,
		loadAuthenticationMethods : loadAuthenticationMethods
	};
}