'use strict'

const error = require('./i-on-web-errors.js');
const mockData = require('./mock-data.js')();
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_authorization = 'Bearer ' + process.env.CORE_READ_TOKEN;
const core_url = process.env.CORE_URL;

// Test simulating a user (to delete)
const user = {
	username: "user",
	password: "123",
	selectedCoursesAndClasses: {} /// {"1": ["1D", "1N", ..], "2": []}
};

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
			const receivedData = await coreRequest(core_url + '/v0/programmes/', 'GET', 200);
	
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
			const receivedData = await coreRequest(core_url + '/v0/programmes/'+ programmeId, 'GET', 200);

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
			const receivedData = await coreRequest(core_url + '/v0/programmes/'+ programmeId, 'GET', 200);
		
			/* Adding missing data */
			const responseMockData = await mockData.loadProgrammeData(programmeId);

			receivedData.properties.name = responseMockData.properties.name;
			receivedData.properties["department"] = responseMockData.properties.department;
			receivedData.properties["department"] = responseMockData.properties.department;
			receivedData.properties["coordination"] = responseMockData.properties.coordination;
			receivedData.properties["contacts"] = responseMockData.properties.contacts;
			receivedData.properties["sourceLink"] = responseMockData.properties.sourceLink;
			receivedData.properties["description"] = responseMockData.properties.description;

			return receivedData;

		} catch(err) {
			switch (err) {
				case 404: /// Not Found
					throw error.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw error.SERVICE_FAILURE;
			}
		}
	};

	const loadCourseByID = async function(courseId) {
		try {
			const receivedData = await coreRequest(core_url + '/v0/courses/'+ courseId +'/classes/1718i', 'GET', 200); // TO DO - change 

			/* Adding missing data */
			const responseMockData = await mockData.loadCourseByID(courseId);

			const responseWithAddedData = receivedData.entities
			.filter(entities => entities.properties.hasOwnProperty('id'))
			.map( entities => {
				entities.properties["name"] = responseMockData.entities[0].properties.name; 
				return entities;
			});

			const response = {'entities': responseWithAddedData};

			return response;

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

	
	// Test functions (to delete)
	const loadUser = async function() {
		try {
			return user;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const saveUserCoursesAndClasses = async function(body) {
		try { 
			// avoid: substitution and repetition
			for (const prop in body) { /// Iterate over body properties (choosen courses)
				if (body.hasOwnProperty(prop) ) { 

					if(!user.selectedCoursesAndClasses.hasOwnProperty(prop)) { /// If the user has not yet chosen that course 
						user.selectedCoursesAndClasses[prop] = body[prop];
					} else { /// If the user has already chosen classes from that course, then it will be added to the array (we filter classes first to avoid repetitions)
						const newClasses = body[prop]
						.filter(
							courseClass => !user.selectedCoursesAndClasses[prop].includes(courseClass)
						);
						user.selectedCoursesAndClasses[prop] = user.selectedCoursesAndClasses[prop].concat(newClasses);
					} 
			
				}
			}
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseByID : loadCourseByID,
		loadAboutData : loadAboutData,
		saveUserCoursesAndClasses : saveUserCoursesAndClasses,
		loadUser : loadUser
	};
}