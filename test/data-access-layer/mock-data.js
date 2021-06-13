'use strict'

module.exports = function() {

	const loadAllProgrammes = async function() {
		try {
			const programmes = getMockData('/programmes');
			return programmes;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		try {
			const path = '/offers/' + programmeId;
			const programmeOffers = getMockData(path);
			return programmeOffers;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadProgrammeData = async function(programmeId) {
		try {
			const path = '/programmes/' + programmeId;
			const programmeData = getMockData(path);
			return programmeData;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadCourseClassesByCalendarTerm = async function(courseId) {
		try {
			const path = '/courses/' + courseId;
			const course = getMockData(path);
			return course;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadAboutData = async function() {
		try {
			return getMockData('/i-on-team');
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadCourseEventCalendar = async function(courseId, semester) {
		try {
			return getMockData('/classes/1718i' + courseId);
		} catch (err) {
			// TO DO - Handle errors
		}
	};
	
	const loadClassSchedule = async function(courseId, classId, semester) {
		try {
			return getMockData('/classes/1718i' + courseId + '/' + classId);
		} catch (err) {
			// TO DO - Handle errors
		}
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

/******* Helper functions *******/

const mockDataPath = '../mock-data';
const getMockData = async function(path) {
	return require(mockDataPath + path);
};