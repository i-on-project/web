'use strict'

let mockUser = {};
let courses = {};

module.exports = function() {

	const loadAllProgrammes = async function() {
			return getMockData('/programmes');
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		const path = '/offers/' + programmeId;
		return getMockData(path);
	};

	const loadProgrammeData = async function(programmeId) {
		const path = '/programmes/' + programmeId;
		return getMockData(path);
	};

	const loadCourseClassesByCalendarTerm = async function(courseId) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/class';
		return getMockData(path);
	};

	const loadAboutData = async function() {
		return getMockData('/i-on-team');
	};
	
	const loadClassSectionSchedule = function(courseId, calendarTerm, classSection) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/classSections/' + classSection;
		return getMockData(path);
	}

	const loadCourseEventsInCalendarTerm = function(courseId, calendarTerm) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/events';
		return getMockData(path);
	}

	/* Authentication related methods */

	const loadAuthenticationMethodsAndFeatures = function () {
		const path = '/auth/authenticationMethodsAndFeatures';
		return getMockData(path);
	};

	const submitInstitutionalEmail = function(email) {
		mockUser['email'] = email;
		mockUser['username'] =  email.slice(0, email.indexOf("@"));
		const path = '/auth/auth_req_id';
		return getMockData(path);
	};

	const pollingCore = function(authForPoll) {
		const path = '/auth/polling_response';
		return getMockData(path);
	};

	/* User related methods */

	const saveUserChosenCoursesAndClasses = function(user, courseId, classSection) {  // TO DO
		return undefined;
	}

	const loadUserSubscribedCourses = function(user) {  // TO DO
		return undefined;
	}

	const loadUserSubscribedClassesInCourse = function(user, courseId) {  // TO DO
		return undefined;
	}

	const deleteUserClass = function(user, courseId, classSection) {  // TO DO
		return undefined;
	}

	const deleteUserCourse = function(user, courseId) {  // TO DO
		return undefined;
	}

	const editUser = function(user, newUsername) {
		mockUser.username = newUsername;
	}

	const loadUser = function(tokens) {// TO DO
		return mockUser;
	}

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadClassSectionSchedule : loadClassSectionSchedule,
		loadCourseEventsInCalendarTerm : loadCourseEventsInCalendarTerm,

		/* Authentication related methods */
		loadAuthenticationMethodsAndFeatures : loadAuthenticationMethodsAndFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore,

		/* User related methods */
		saveUserChosenCoursesAndClasses : saveUserChosenCoursesAndClasses,
		loadUserSubscribedCourses : loadUserSubscribedCourses,
		loadUserSubscribedClassesInCourse : loadUserSubscribedClassesInCourse,
		deleteUserClass : deleteUserClass,
		deleteUserCourse : deleteUserCourse,
		editUser : editUser,
		loadUser : loadUser
	};
}

/******* Helper functions *******/

const mockDataPath = '../mock-data';
const getMockData = async function(path) {
	try{
		return require(mockDataPath + path);
	} catch(err) {
		return undefined; // TO DO - Review
	}
};