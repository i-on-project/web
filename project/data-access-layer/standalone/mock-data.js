'use strict'

const internalErrors = require('../../common/i-on-web-errors.js');
const base64url = require('base64url');

let users = {};
const mockUsersLimit = 50;

module.exports = function() {

	const loadAllProgrammes = function() {
		const data = getMockData('/programmes');
		if(!data) throw internalErrors.RESOURCE_NOT_FOUND;
		return JSON.parse(JSON.stringify(data)); // Clone object
	};

	const loadProgramme = async function(programmeId) {
		const path = '/programmes/' + programmeId;
		const data = getMockData(path);
		if(!data) throw internalErrors.RESOURCE_NOT_FOUND;
		return JSON.parse(JSON.stringify(data));
	};

	const loadClassByCalendarTerm = async function(courseId, calendarTerm)  {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/class';
		const data = getMockData(path);
		if(!data) return {"classSections": []};
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

	const loadCalendarTerm = async function() {
		const path = '/current_calendar_term';
		const data = getMockData(path);
		if(!data) throw internalErrors.SERVICE_FAILURE;
		return JSON.parse(JSON.stringify(data));
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
		if(Object.keys(users).length < mockUsersLimit) {
			if(!users.hasOwnProperty(email)) {
				users[`${email}`] = {
					"email": email,
					"username": email.slice(0, email.indexOf("@")),
					"subscriptions": []
				};
			}
		}
		return {
			"auth_req_id": email,  /// In order to simulate the authentication
			"expires_in": 20
		};
	};

	const pollingCore = async function(authForPoll) {
		if(Object.keys(users).length < mockUsersLimit || users.hasOwnProperty(authForPoll)) {  
			
			/// Creating an id token
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

	const saveUserSubscriptions = async function(user, id, classSection) {
		const calendarTerm = await loadCalendarTerm();
		const path = '/calendarTerms/' + calendarTerm.currentCalendarTerm + '/' + id + '/class';
		const receivedData = await getMockData(path);

		if(receivedData) {
			const data = JSON.parse(JSON.stringify(receivedData));
			delete data.classSections;
			data['calendarTerm'] = calendarTerm.currentCalendarTerm;
	
			let subscribedToClass = false;

			for(let i = 0; i < users[user.email].subscriptions.length; i++) {
				
				if(users[user.email].subscriptions[i].id == id) { 
					/// User is already subscribed to a class section of this class and now (as long as its not the ones hes already subscribed to)
					/// he is going to subscribe one more class section
					subscribedToClass = true;
					if(!users[user.email].subscriptions[i].classes.includes(classSection)) {
						users[user.email].subscriptions[i].classes.push(classSection);
					}
				}
			} 
			/// User is subscribing for the first time to a class section of a certain classs
			if(!subscribedToClass) {
				const course = data;
				course['classes'] = [classSection];
				users[user.email].subscriptions.push(course);
			}
		};

	}

	const loadUserSubscribedClassSectionsInClass = async function(user, id) {
		return users[user.email].subscriptions.filter(course => course.id == id).find(__ => __).classes;
	}

	const getUserSubscriptions = function(user) {
		return users[user.email].subscriptions;
	}

	const deleteUserSubscriptions = async function(user, id, classSection) {
	
		const classSections = users[user.email].subscriptions
			.filter(course => course.id == id)
			.find(__ => __).classes;

		const classSectionsSize = classSections.length;

		/// Delete the class section from the user subscriptions
		for( let i = 0; i < classSectionsSize; i++){ 
			if ( classSections[i] == classSection) { 
				users[user.email].subscriptions
				.filter(course => course.id == id)
				.find(__ => __).classes.splice(i, 1); 
			}
		}

	}

	const deleteUserClass = async function(user, id) {
		/// Delete the class from the user subscriptions
		for( let i = 0; i < users[user.email].subscriptions.length; i++){ 
			if ( users[user.email].subscriptions[i].id == id) { 
				users[user.email].subscriptions.splice(i, 1); 
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
		/* Methods to load generic academic information */
        loadAllProgrammes : loadAllProgrammes,
		loadProgramme : loadProgramme,
		loadClassByCalendarTerm : loadClassByCalendarTerm,
		loadAboutData : loadAboutData,
		loadClassSectionSchedule : loadClassSectionSchedule,
		loadCourseEventsInCalendarTerm : loadCourseEventsInCalendarTerm,
		loadCalendarTerm : loadCalendarTerm,
		loadCalendarTermGeneralInfo : loadCalendarTermGeneralInfo,

		/* Methods related to authentication */
		loadAuthenticationMethodsAndFeatures : loadAuthenticationMethodsAndFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore,

		/* Methods related to user */
		saveUserSubscriptions : saveUserSubscriptions,
		loadUserSubscribedClassSectionsInClass : loadUserSubscribedClassSectionsInClass,
		getUserSubscriptions : getUserSubscriptions,
		deleteUserSubscriptions : deleteUserSubscriptions,
		deleteUserClass : deleteUserClass,
		editUser : editUser,
		loadUser : loadUser,
		deleteUser : deleteUser,
		refreshAccessToken : refreshAccessToken,
		revokeAccessToken : revokeAccessToken
	};
}

/******* Helper functions *******/

const mockDataPath = '../../mock-data/standalone';
const getMockData = function(path) {
	try{
		return require(mockDataPath + path);
	} catch(err) {
		return undefined;
	}
};