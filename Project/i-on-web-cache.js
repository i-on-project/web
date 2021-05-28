'use strict'

const data = require('./add-missing-data.js')();
const Cache = require('./cache.js');
const myCache = new Cache(60 * 60 * 24); /// 1 Day

module.exports = function() {

	const loadAllProgrammes = async function() {
		console.log("\n[Cache] - Passing by... ");
		const response = await data.loadAllProgrammes();
        console.log("\n[Cache] - received info: " + JSON.stringify(response));

		await myCache.set('programmes', response);
		const programmes = await myCache.get('programmes');
		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmes));

		return response.data;
	};

	const loadAllProgrammeOffers = async function(programmeId) {

	};

	const loadProgrammeData = async function(programmeId) {

	};

	const loadCourseClassesByCalendarTerm = async function(courseId) {

	};

	const loadAboutData = async function() {

	};

	const loadCourseEventCalendar = async function(courseId, semester) {

	};
	
	const loadClassSchedule = async function(courseId, classId, semester) {

	};
	
	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadCourseEventCalendar : loadCourseEventCalendar,
		loadClassSchedule : loadClassSchedule
	};
}