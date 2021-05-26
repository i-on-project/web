'use strict'

const data = require('./core-data-transformer.js')();

module.exports = function() {

	const loadAllProgrammes = async function () {
		const response = await data.loadAllProgrammes();

		/* Adding missing data */
		const mockDataToBeAdded = await getMockData('./data/programmes');

		const improvedResponse = response
		.map( programme => {
			const mockProgramme = mockDataToBeAdded.entities // TO DO - Change
			.filter( mockEntities => mockEntities.properties.programmeId == programme.programmeId)[0].properties;

			programme["name"] = mockProgramme.name;
			programme["degree"] = mockProgramme.degree;

			return programme;
		});

		return improvedResponse;
	};

	const loadAllProgrammeOffers = async function (programmeId) {
		const response = await data.loadAllProgrammeOffers(programmeId);

		/* Adding missing data */ 
		const path = './data/offers/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);

		const improvedResponse = response.map( offer => {
			const mockOffer = mockDataToBeAdded.entities
			.filter( mockEntities => mockEntities.properties.courseId == offer.courseId)[0].properties;

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

	const loadCourseClassesByCalendarTerm = async function(courseId) {
		const response = await data.loadCourseClassesByCalendarTerm(courseId);

		/* Adding missing data */
		const path = './data/courses/' + courseId;
		const mockDataToBeAdded = await getMockData(path);

		response['name'] = mockDataToBeAdded.entities[0].properties.name;
		return response;
	}

	const loadAboutData = async function () {
		let response = await data.loadAboutData();

		/* Adding missing data */ 
		response = await getMockData('./data/i-on-team');

		return response;
	};

	const loadAuthenticationTypes = async function () {
		return await data.loadAuthenticationTypes();
	};

	const loadAuthenticationMethodFeatures = async function () {
		return await data.loadAuthenticationMethodFeatures();
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadAuthenticationTypes : loadAuthenticationTypes,
		loadAuthenticationMethodFeatures : loadAuthenticationMethodFeatures
	};
}

/******* Helper function *******/
const getMockData = async function(path) {
	return require(path);
};