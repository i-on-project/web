'use strict'

const data = require('./i-on-web-transform.js')();

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

		const improvedResponse = coreResponse // TO DO - Change
		.filter(entities => entities.properties.hasOwnProperty('id'))
		.map( entities => {
			entities.properties["name"] = mockDataToBeAdded.entities[0].properties.name; 
			return entities;
		});

		return improvedResponse;
	}

	const loadAboutData = async function () { // ver melhor
		let response = await data.loadAboutData();

		/* Adding missing data */ 
		response = await getMockData('./data/i-on-team');

		return response;
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData
	};
}

/******* Helper function *******/
const getMockData = async function(path) {
	return require(path);
};