'use strict'

const mockData = require('./mock-data.js')();
const coreData = require('./core-data.js')();

module.exports = function() {

	const loadAllProgrammes = async function () {
		const coreResponse = await coreData.loadAllProgrammes();

		/* Adding missing data */
		const mockDataToBeAdded = await mockData.loadAllProgrammes();
		const improvedResponse = coreResponse.entities
		.map( entities => {
			const programme = mockDataToBeAdded.entities
			.filter( mockEntities => mockEntities.properties.programmeId == entities.properties.programmeId)[0].properties
			
			entities.properties["name"] = programme.name;
			entities.properties["degree"] = programme.degree;

			return entities;
		});

		return {'entities': improvedResponse};
	};

	const loadAllProgrammeOffers = async function (programmeId) {
		const coreResponse = await coreData.loadAllProgrammeOffers();

		/* Adding missing data */ 
		const mockDataToBeAdded = await mockData.loadAllProgrammeOffers(programmeId);
		const improvedResponse = coreResponse.entities
			.map( entities => {
				const offer = mockDataToBeAdded.entities
				.filter( mockEntities => mockEntities.properties.courseId == entities.properties.courseId)[0].properties;

				entities.properties["name"] = offer.name;
				entities.properties["acronym"] = offer.acronym;
				entities.properties["optional"] = offer.optional;
				entities.properties["ects"] = offer.ects;
				entities.properties["scientificArea"] = offer.scientificArea;
				return entities;
			})

		return {'entities': improvedResponse};
	};

	const loadProgrammeData = async function (programmeId) {
		const coreResponse = await coreData.loadProgrammeData(programmeId);
	
		/* Adding missing data */
		const mockDataToBeAdded = await mockData.loadProgrammeData(programmeId);

		coreResponse.properties.name = mockDataToBeAdded.properties.name;
		coreResponse.properties["department"] = mockDataToBeAdded.properties.department;
		coreResponse.properties["department"] = mockDataToBeAdded.properties.department;
		coreResponse.properties["coordination"] = mockDataToBeAdded.properties.coordination;
		coreResponse.properties["contacts"] = mockDataToBeAdded.properties.contacts;
		coreResponse.properties["sourceLink"] = mockDataToBeAdded.properties.sourceLink;
		coreResponse.properties["description"] = mockDataToBeAdded.properties.description;

		return coreResponse;
	};

	const loadCourse = async function(courseId) {
		const coreResponse = await coreData.loadCourse(courseId);

		/* Adding missing data */
		const mockDataToBeAdded = await mockData.loadCourseByID(courseId);

		const improvedResponse = coreResponse.entities
		.filter(entities => entities.properties.hasOwnProperty('id'))
		.map( entities => {
			entities.properties["name"] = mockDataToBeAdded.entities[0].properties.name; 
			return entities;
		});

		return {'entities': improvedResponse};
	}

	const loadAboutData = async function () { // ver melhor
		const coreResponse = await coreData.loadAboutData();
		/* Adding missing data */ 
		const coreResponse = await mockData.loadAboutData();
		
		return coreResponse;
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourse : loadCourse,
		loadAboutData : loadAboutData
	};
}