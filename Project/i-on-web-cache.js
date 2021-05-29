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

		return programmes.data; // TO DO - remove .data
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		console.log("\n[Cache] - Passing by... ");

		const programmeOffers = await myCache.get(
			programmeId + "offers", 
			data.loadAllProgrammeOffers(programmeId) 
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmeOffers));

		return programmeOffers.data; // TO DO - remove .data
	};

	const loadProgrammeData = async function(programmeId) {
		console.log("\n[Cache] - Passing by... ");

		const programmeData = await myCache.get(
			programmeId, 
			data.loadProgrammeData(programmeId) 
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmeData));

		return programmeData.data; // TO DO - remove .data
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm) {
		console.log("\n[Cache] - Passing by... ");

		const programmeData = await myCache.get(
			courseId + calendarTerm, 
			data.loadCourseClassesByCalendarTerm(programmeId, calendarTerm)  
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmeData));

		return programmeData.data; // TO DO - remove .data
	};

	const loadAboutData = async function() {
		console.log("\n[Cache] - Passing by... ");

		const aboutData = await myCache.get(
			"about", 
			data.loadAboutData
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(aboutData));

		return aboutData.data; // TO DO - remove .data
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