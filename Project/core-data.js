'use strict'

const error = require('./i-on-web-errors.js');
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_token = 'Bearer ' + process.env.CORE_READ_TOKEN;
const core_url = process.env.CORE_URL;
const client_id = "22dd1551-db23-481b-acde-d286440388a5"; /// TO DO: In future renove dev client id to production on .. process.env.CORE_CLIENT_ID | 

const coreRequest = async function(endpoint, expectedStatus, options) {
	// core_url + endpoint
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

			console.log("\n[CORE-DATA] - Making request ...");
			const response = await fetch(core_url + '/api/programmes/', options);
			if(response.status != 200) throw response.status;
			console.log("\n[CORE-DATA] - Returning response ...");

			return response;

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

			return await coreRequest('/api/programmes/'+ programmeId, 200, options);	

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

			return await coreRequest('/api/programmes/'+ programmeId, 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/courses/'+ courseId +'/classes/' + calendarTerm, 200, options); // TO DO - change 

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

	const loadAuthenticationTypes = async function () {
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

	const loadAuthenticationMethodFeatures = async function () {
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

	const submitInstitutionalEmail = async function(email) {
		try {
			
			const options = {
				method: 'POST',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				},
				body: JSON.stringify({
					"scope": "profile",
					"type": "email",
					"client_id": client_id,
					"notification_method": "POLL",
					"email": email
				})
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

	const pollingCore = async function(authForPoll) {
		try {
			
			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
			
			const response = await fetch(core_url + `/api/auth/request/${authForPoll}/poll`, options);

			console.log("status in core -> " + response.status);
		
			return response.json();

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
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadAuthenticationTypes : loadAuthenticationTypes,
		loadAuthenticationMethodFeatures : loadAuthenticationMethodFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore
	};
}