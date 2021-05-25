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

		return receivedData.entities;
	}
	
	const loadAboutData = async function () {
		return await data.loadAboutData();
	};

	const loadAuthenticationMethods = async function () {
		return data.loadAuthenticationMethods();
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