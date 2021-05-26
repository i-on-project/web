'use strict'

const data = require('./mock-data.js')();

module.exports = function() {

	const loadAllProgrammes = async function () {
		const receivedData = await data.loadAllProgrammes();

		return receivedData.entities.map(entities => entities.properties);
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		const receivedData = await data.loadAllProgrammeOffers(programmeId);

		return receivedData.entities.map(entities => entities.properties);
	};

	const loadProgrammeData = async function(programmeId) {
		const receivedData = await data.loadProgrammeData(programmeId);
	
		return receivedData.properties;
	};

	const loadCourseClassesByCalendarTerm = async function(courseId) {
		const receivedData = await data.loadCourseClassesByCalendarTerm(courseId);

		return receivedData.entities.map(entity => entity.properties)
		.reduce(function(newResponse, currentClass) {
			newResponse['courseId'] = currentClass.courseId;
			newResponse['acronym'] = currentClass.acronym;
			newResponse.classes.push(currentClass.id);
			return newResponse;
		  }, {'classes': []});
	}
	
	const loadAboutData = async function () {
		return await data.loadAboutData();
	};

	/******* Authentication *******/ 

	const loadAuthenticationTypes = async function () {

		const receivedData = await data.loadAuthenticationTypes();
		const auth_types = receivedData.map(method => method.type);

		return {
			"auth_types" : auth_types
		};
	};

	const loadAuthenticationMethodFeatures = async function () {

		const receivedData = await data.loadAuthenticationMethodFeatures();
		const auth_methods = receivedData.map(method => {
			return {
				"allowed_domains": method.allowed_domains,
				"type": method.type
			};
		});

		return {
			"auth_methods" : auth_methods
		};
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