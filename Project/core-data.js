'use strict'

const error = require('./i-on-web-errors.js');
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_authorization = 'Bearer ' + process.env.CORE_READ_TOKEN;
const core_url = process.env.CORE_URL;


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
			return await coreRequest(core_url + '/v0/programmes/', 'GET', 200);
		} catch(err) {
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
			return await coreRequest(core_url + '/v0/programmes/'+ programmeId, 'GET', 200);	
		} catch(err) {
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
			return await coreRequest(core_url + '/v0/programmes/'+ programmeId, 'GET', 200);
		} catch(err) {
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
			return await coreRequest(core_url + '/v0/courses/'+ courseId +'/classes/1718i', 'GET', 200); // TO DO - change 
		} catch (err) {
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
		} catch(err) {
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
		loadAboutData : loadAboutData
	};
}