'use strict'

const data = require('./core-data-transformer.js')();

module.exports = function() {

	const loadAllProgrammes = async function (pleaseWork, lastModified) {
		console.log("\n[Add Missing Data] - Passing by add missing data... " + "id: " + pleaseWork + "LM: " + lastModified);
		const utcTime = lastModified ? new Date(lastModified * 1000) : undefined;
		const response = await data.loadAllProgrammes(utcTime);

		if(!response) return; /// The resource has not been modified since the given date
		console.log("\n[Add Missing Data] - Received info: " + JSON.stringify(response));

		/*** Adding missing data ***/
		const mockDataToBeAdded = await getMockData('./data/programmes');

		response.metadata = {
			'lastModified': 1622207500 // Fri, 28 May 2021 13:11:40 GMT
		};

		const improvedMetadata = response.metadata;

		const improvedData = response.data
		.map( programme => {
			const mockProgramme = mockDataToBeAdded.entities
			.find( mockEntities => mockEntities.properties.programmeId == programme.programmeId).properties;

			programme["name"] = mockProgramme.name;
			programme["degree"] = mockProgramme.degree;

			return programme;
		});
		console.log("\n[Add Missing Data] -returning ..")
		return {
			"data" : improvedData,
			"metadata" : improvedMetadata
		}
	};

	const loadAllProgrammeOffers = async function (programmeId) {
		const response = await data.loadAllProgrammeOffers(programmeId);

		/* Adding missing data */ 
		const path = './data/offers/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);

		const improvedResponse = response.map( offer => {
			const mockOffer = mockDataToBeAdded.entities
			.find( mockEntities => mockEntities.properties.courseId == offer.courseId).properties;

			offer["name"] = mockOffer.name;
			offer["acronym"] = mockOffer.acronym;
			offer["optional"] = mockOffer.optional;
			offer["ects"] = mockOffer.ects;
			offer["scientificArea"] = mockOffer.scientificArea;
			return offer;
		})

		return improvedResponse;
	};

	const loadProgrammeData = async function (programmeId) {
		const response = await data.loadProgrammeData(programmeId);
	
		/* Adding missing data */
		const path = './data/programmes/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);
		
		// TO DO - Change
		response.name = mockDataToBeAdded.properties.name;
		response["department"] = mockDataToBeAdded.properties.department;
		response["department"] = mockDataToBeAdded.properties.department;
		response["coordination"] = mockDataToBeAdded.properties.coordination;
		response["contacts"] = mockDataToBeAdded.properties.contacts;
		response["sourceLink"] = mockDataToBeAdded.properties.sourceLink;
		response["description"] = mockDataToBeAdded.properties.description;

		return response;
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const response = await data.loadCourseClassesByCalendarTerm(courseId, calendarTerm) ;

		/* Adding missing data */
		const path = './data/courses/' + courseId;
		const mockDataToBeAdded = await getMockData(path);

		response['name'] = mockDataToBeAdded.entities.find(__ => __).properties.name;
		return response;
	}

	const loadAboutData = async function () {
		let response = await data.loadAboutData();

		/* Adding missing data */ 
		response = await getMockData('./data/i-on-team');

		return response;
	};

	const loadAuthenticationTypes = function () {
		return data.loadAuthenticationTypes();
	};

	const loadAuthenticationMethodFeatures = function () {
		return data.loadAuthenticationMethodFeatures();
	};

	const submitInstitutionalEmail = function(email) {
		return data.submitInstitutionalEmail(email);
	};

	const pollingCore = function(authForPoll) {
		return data.pollingCore(authForPoll);
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

/******* Helper function *******/
const getMockData = async function(path) {
	return require(path);
};