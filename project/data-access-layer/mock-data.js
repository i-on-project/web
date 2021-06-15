'use strict'

let mockUser = {};
let courses = [];
let classes = [];

module.exports = function() {

	const loadAllProgrammes = async function() {
		const data = getMockData('/programmes');
		return data? data : [];
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		const path = '/offers/' + programmeId;
		const data = getMockData(path);
		return data? data : [];
	};

	const loadProgrammeData = async function(programmeId) {
		const path = '/programmes/' + programmeId;
		const data = getMockData(path);
		return data? data : {};
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/class';
		const data = getMockData(path);
		return data? data : {};
	};

	const loadAboutData = async function() {
		const data = getMockData('/i-on-team');
		return data? data : {};
	};
	
	const loadClassSectionSchedule = function(courseId, calendarTerm, classSection) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/classSections/' + classSection;
		const data = getMockData(path);
		return data? data : [];
	}

	const loadCourseEventsInCalendarTerm = function(courseId, calendarTerm) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/events';
		const data = getMockData(path);
		return data? data : {};
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
		const path = '/user-courses/' + courseId;
		const data = getMockData(path);
		if(data) {
			courses.push(data);
			if(classes.courseId)
				classes.courseId.push(classSection);
			else{ 
				classes[courseId] = [classSection]
				classes.push(classes[courseId]);
			}
		};
	}

	const loadUserSubscribedCourses = function(user) {  // TO DO
		return courses;
	}

	const loadUserSubscribedClassesInCourse = function(user, courseId) {  // TO DO
		return classes[courseId];
	}

	const deleteUserClass = function(user, courseId, classSection) {  // TO DO

	}

	const deleteUserCourse = function(user, courseId) {  // TO DO
		for( let i = 0; i < courses.length; i++){ 
			if ( courses[i].courseId === courseId) { 
				courses.splice(i, 1); 
			}
		}
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
const getMockData = function(path) {
	try{
		return require(mockDataPath + path);
	} catch(err) {
		return undefined;
	}
};