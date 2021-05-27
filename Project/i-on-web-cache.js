'use strict'

module.exports = function() {

	const loadAllProgrammes = async function() {

        

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