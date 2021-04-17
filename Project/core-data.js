'use strict'

const error = require('./i-on-web-errors.js');
const mockData = require('./mock-data.js')();
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_authorization = 'Bearer ' + process.env.CORE_READ_TOKEN;
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
			const receivedData = await coreRequest(core_uri + '/v0/programmes/', 'GET', 200);
			
			/* Adding missing data */
			const responseMockData = await mockData.loadAllProgrammes();
			const responseWithAddedData = receivedData.entities
			.map( entities => {
				const programme = responseMockData.entities
				.filter( mockEntities => mockEntities.properties.programmeId == entities.properties.programmeId)[0].properties
				
				entities.properties["name"] = programme.name;
				entities.properties["degree"] = programme.degree;

				return entities;
			});
			const response = {'entities': responseWithAddedData};

			return response;

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
			const receivedData = await coreRequest(core_uri + '/v0/programmes/'+ programmeId, 'GET', 200);

			/* Adding missing data */ 
			const responseMockData = await mockData.loadAllProgrammeOffers(programmeId);

			const responseWithAddedData = receivedData.entities
			.map( entities => {
				const offer = responseMockData.entities
				.filter( mockEntities => mockEntities.properties.courseId == entities.properties.courseId)[0].properties;

				entities.properties["name"] = offer.name;
				entities.properties["acronym"] = offer.acronym;
				entities.properties["optional"] = offer.optional;
				entities.properties["ects"] = offer.ects;
				entities.properties["scientificArea"] = offer.scientificArea;
				return entities;
			});

			const response = {'entities': responseWithAddedData};

			return response;

		
		} catch(err) {
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadProgrammeData = async function (programmeId) {
		try {
			const response = await coreRequest(core_uri + '/v0/programmes/'+ programmeId, 'GET', 200);
		
			/* Adding missing data */
			const responseMockData = await mockData.loadProgrammeData(programmeId);

			response.properties.name = responseMockData.properties.name;
			response.properties["department"] = responseMockData.properties.department;
			response.properties["department"] = responseMockData.properties.department;
			response.properties["coordination"] = responseMockData.properties.coordination;
			response.properties["contacts"] = responseMockData.properties.contacts;
			response.properties["sourceLink"] = responseMockData.properties.sourceLink;
			response.properties["description"] = responseMockData.properties.description;

			return response;

		} catch(err) {
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadAboutData = async function () {
		try {
			/* Adding missing data */ 
			return await mockData.loadAboutData();
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
		loadAboutData : loadAboutData
	};
}