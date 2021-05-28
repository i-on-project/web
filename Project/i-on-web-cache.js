'use strict'

const data = require('./add-missing-data.js')();
const Cache = require('./cache.js');
const myCache = new Cache(60 * 60 * 24); /// 1 Day

module.exports = function() {

	const loadAllProgrammes = async function() {
		console.log("\n[Cache] - Passing by... ");

		const programmes = await myCache.get(
			"programmes", 
			data.loadAllProgrammes 
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmes));

		return programmes.data;
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