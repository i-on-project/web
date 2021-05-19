'use strict'

const mockData = require('./mock-data.js')();
const dbElastic = require('./i-on-web-db-elastic.js')();

module.exports = function() {

	const loadAllProgrammes = async function() {
		return await mockData.loadAllProgrammes();
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		return await mockData.loadAllProgrammeOffers(programmeId);
	};

	const loadProgrammeData = async function(programmeId) {
		return await mockData.loadProgrammeData(programmeId);
	};

	const loadCourse = async function(courseId) {
		return await mockData.loadCourse(courseId);
	};

	const loadAboutData = async function() {
		return await mockData.loadAboutData();
	};

	const getUser = async function(username) {
		return await dbElastic.getUser(username);
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourse : loadCourse,
		loadAboutData : loadAboutData,
		getUser : getUser
	};
}
