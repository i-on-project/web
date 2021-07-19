'use strict'

const internalErrors = require('../common/i-on-web-errors.js');
const base64url = require('base64url');

let users = {};
const mock_users_limit = 3;

module.exports = function() {

	const loadAllProgrammes = function() {
		const data = getMockData('/programmes');
		if(!data) throw internalErrors.RESOURCE_NOT_FOUND;
		return JSON.parse(JSON.stringify(data));;
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		const path = '/offers/' + programmeId;
		const data = getMockData(path);
		if(!data) throw internalErrors.RESOURCE_NOT_FOUND;
		return JSON.parse(JSON.stringify(data));;
	};

	const loadProgrammeData = async function(programmeId) {
		const path = '/programmes/' + programmeId;
		const data = getMockData(path);
		if(!data) throw internalErrors.RESOURCE_NOT_FOUND;
		return JSON.parse(JSON.stringify(data));
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/class';
		const data = getMockData(path);
		if(!data) return {"classes": []};
		return JSON.parse(JSON.stringify(data));;
	};

	const loadAboutData = async function() {
		const data = getMockData('/i-on-team');
		if(!data) throw internalErrors.RESOURCE_NOT_FOUND;
		return JSON.parse(JSON.stringify(data));;
	};
	
	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/classSections/' + classSection;
		const data = getMockData(path);
		if(!data) throw internalErrors.SERVICE_FAILURE;
		return JSON.parse(JSON.stringify(data));;
	}

	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/events';
		const data = getMockData(path);
		if(!data) throw internalErrors.RESOURCE_NOT_FOUND;
		return JSON.parse(JSON.stringify(data));;
	}

	const loadCurrentCalendarTerm = async function() {
		const path = '/current_calendar_term';
		const data = getMockData(path);
		if(!data) throw internalErrors.SERVICE_FAILURE;
		return JSON.parse(JSON.stringify(data.calendarTerm));
	}
		
	const loadCalendarTermGeneralInfo = async function(calendarTerm) {
		const path = '/calendarTerms/' + calendarTerm + '/semester_calendar';
		const data = await getMockData(path);
		if(!data) throw internalErrors.SERVICE_FAILURE;
		return JSON.parse(JSON.stringify(data));
	}

	/* Authentication related methods */

	const loadAuthenticationMethodsAndFeatures = async function () {
		const path = '/auth/authenticationMethodsAndFeatures';
		const data = getMockData(path);
		if(!data) throw internalErrors.SERVICE_FAILURE;
		return JSON.parse(JSON.stringify(data));
	};

	const submitInstitutionalEmail = async function(email) {
		if(Object.keys(users).length < mock_users_limit) {
			if(!users.hasOwnProperty(email)) {
				users[`${email}`] = {
					"email": email,
					"username": email.slice(0, email.indexOf("@")),
					"classesAndClassSections": []
				};
			}
		}
		return {
			"auth_req_id": email,
			"expires_in": 20
		};
	};

	const pollingCore = async function(authForPoll) {
		if(Object.keys(users).length < mock_users_limit || users.hasOwnProperty(authForPoll)) {  
			
			const encodedData = base64url(JSON.stringify({"email": authForPoll}));
			const token = "eyJhbGciOiJIUzI1NiJ9." + encodedData;
		
			return {
			 "access_token": "",
			 "token_type": "",
			 "id_token": token
			}; 
		} else {
			return {};
		}
	};

	/* User related methods */

	const saveUserClassesAndClassSections = async function(user, id, classSection) {
		const calendarTerm = await loadCurrentCalendarTerm();
		const path = '/calendarTerms/' + calendarTerm + '/' + id + '/class';
		const receidedData = await getMockData(path);

		if(receidedData) {
			const data = JSON.parse(JSON.stringify(receidedData))
			delete data.classes;
			data['calendarTerm'] = calendarTerm;

			let subscribedToCourse = false;

			for(let i = 0; i < users[user.email].classesAndClassSections.length; i++) {
				if(users[user.email].classesAndClassSections[i].id == id) { // ===
					subscribedToCourse = true;
					if(!users[user.email].classesAndClassSections[i].classes.includes(classSection)) {
						users[user.email].classesAndClassSections[i].classes.push(classSection);
					}
				}
			} 
			if(users[user.email].classesAndClassSections.length === 0 || !subscribedToCourse) {
				const course = data;
				course['classes'] = [classSection];
				users[user.email].classesAndClassSections.push(course);
			}
		};
	}

	const loadUserSubscribedClassSectionsInClass = async function(user, id) {
		return users[user.email].classesAndClassSections.filter(course => course.id == id).find(__ => __).classes;
	}

	const loadUserSubscribedClassesAndClassSections = function(user) {
		return users[user.email].classesAndClassSections;
	}

	const deleteUserClassSection = async function(user, id, classSection) {
		const classSections = users[user.email].classesAndClassSections
		.filter(course => course.id == id).find(__ => __).classes;

		const classSectionsSize = classSections.length;

		for( let i = 0; i < classSectionsSize; i++){ 
			if ( classSections[i] == classSection) { 
				users[user.email].classesAndClassSections
				.filter(course => course.id == id)
				.find(__ => __).classes.splice(i, 1); 
			}
		}
	}

	const deleteUserClass = async function(user, id) {
		for( let i = 0; i < users[user.email].classesAndClassSections.length; i++){ 
			if ( users[user.email].classesAndClassSections[i].id == id) { 
				users[user.email].classesAndClassSections.splice(i, 1); 
			}
		}
	}

	const editUser = async function(user, newUsername) {
		users[user.email].username = newUsername;
	}

	const loadUser = async function(access_token, token_type, email) {
		return users[email];
	}

	const deleteUser = async function(user) {
		delete users[user.email];
	}

	const refreshAccessToken = function(user) {};
	
	const revokeAccessToken = function(user) {};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadClassSectionSchedule : loadClassSectionSchedule,
		loadCourseEventsInCalendarTerm : loadCourseEventsInCalendarTerm,
		loadCurrentCalendarTerm : loadCurrentCalendarTerm,
		loadCalendarTermGeneralInfo : loadCalendarTermGeneralInfo,

		/* Authentication related methods */
		loadAuthenticationMethodsAndFeatures : loadAuthenticationMethodsAndFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore,

		/* User related methods */
		saveUserClassesAndClassSections : saveUserClassesAndClassSections,
		loadUserSubscribedClassSectionsInClass : loadUserSubscribedClassSectionsInClass,
		loadUserSubscribedClassesAndClassSections : loadUserSubscribedClassesAndClassSections,
		deleteUserClassSection : deleteUserClassSection,
		deleteUserClass : deleteUserClass,
		editUser : editUser,
		loadUser : loadUser,
		deleteUser : deleteUser,
		refreshAccessToken : refreshAccessToken,
		revokeAccessToken : revokeAccessToken
	};
}

/******* Helper functions *******/

const mockDataPath = '../mock-data/standalone';
const getMockData = function(path) {
	try{
		return require(mockDataPath + path);
	} catch(err) {
		return undefined;
	}
};