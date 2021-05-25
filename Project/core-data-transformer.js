'use strict'

const data = require('./core-data.js')();

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

		return receivedData.entities;
	}
	
	const loadAboutData = async function () {
		return await data.loadAboutData();
	};

	/// Authentication methods
	const loadAuthenticationMethods = async function () {
		const receivedData = await data.loadAuthenticationMethods();

		const auth_methods = receivedData.map(method => method.type);

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
		loadAuthenticationMethods : loadAuthenticationMethods
	};
}