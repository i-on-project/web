'use strict'

const internalErrors = require('../common/i-on-web-errors.js');
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_token = 'Bearer ' + process.env.CORE_READ_TOKEN;
const core_url = process.env.CORE_URL;
const client_id = process.env.CORE_CLIENT_ID; /// TO DO: In future remove dev client id
const client_secret = process.env.CORE_CLIENT_SECRET;

const coreRequest = async function(endpoint, expectedStatus, options) {
	// core_url + endpoint
	const response = await fetch(core_url + endpoint, options);
	
	if(response.status != expectedStatus) throw response.status;
	
	return response.json();
};

module.exports = function() {

	const loadAllProgrammes = async function () {
		try {
			
			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType,
				}
			};
			return await coreRequest('/api/programmes/', 200, options);	

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404:	/// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default:	/// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadAllProgrammeOffers = async function (programmeId) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/programmes/'+ programmeId, 200, options);	

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadProgrammeData = async function(programmeId) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/programmes/'+ programmeId, 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/courses/'+ courseId +'/classes/' + calendarTerm, 200, options);

		} catch (err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	}
	
	const loadAboutData = async function () {
		try {
		
			return {}; // Request still not suported by i-on Core

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Accept': 'application/vnd.siren+json'
				}
			};
	

			return await coreRequest('/api/courses/'+ courseId +'/classes/' + calendarTerm + '/' + classSection + '/calendar', 200, options); 

		} catch (err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Accept': 'application/vnd.siren+json'
				}
			};

			return await coreRequest('/api/courses/'+ courseId +'/classes/' + calendarTerm + '/calendar', 200, options);

		} catch (err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadCurrentCalendarTerm = function() {
		try {
		
			return {}; // Request still not suported by i-on Core

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};
	
	const loadCalendarTermGeneralInfo = function(calendarTerm) {
		try {
		
			return {}; // Request still not suported by i-on Core

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	
	/* Authentication related methods */

	const loadAuthenticationMethodsAndFeatures = async function () {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
			
			return await coreRequest('/api/auth/methods', 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const submitInstitutionalEmail = async function(email) {
		try {
			const options = {
				method: 'POST',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				},
				body: JSON.stringify({
					"scope": "openid profile classes",
					"acr_values": "email",
					"client_id": client_id,
					"login_hint": email
				})
			};
			
			return await coreRequest('/api/auth/backchannel', 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const pollingCore = async function(authForPoll) {
		try {
			
			const options = {
				method: 'POST',
				headers: {
					'Authorization': read_token,
					'Content-Type': contentType
				},
				body: JSON.stringify({
					"grant_type": "urn:openid:params:grant-type:ciba",
					"auth_req_id": authForPoll,
					"client_id": client_id,
					"client_secret": client_secret
				})
			};
			
			const response = await fetch(core_url + '/api/auth/token', options);
			// TO DO: Check response status code
			return response.json();

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	/* User related methods */

	const saveUserChosenCoursesAndClasses = async function(user, courseId, classSection) {
		try {
			const options = {
				method: 'PUT',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/users/classes/' + courseId + '/' + classSection, options);
		
			if(response.status != 201 && response.status != 204) throw response.status; // TO DO - handle the status code

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadUserSubscribedCourses = async function(user) {
		try {
			const options = {
				method: 'GET',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/users/classes/', 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadUserSubscribedClassesInCourse = async function(user, courseId) {
		try {
			const options = {
				method: 'GET',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/users/classes/' + courseId, 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const deleteUserClass = async function(user, courseId, classSection) {
		try {
			const options = {
				method: 'DELETE',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};
		
			const response = await fetch(core_url + '/api/users/classes/' + courseId + '/' + classSection, options);

			if(response.status != 204) throw response.status; // TO DO - handle the status code

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const deleteUserCourse = async function(user, courseId) {
		try {
			const options = {
				method: 'DELETE',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/users/classes/' + courseId, options);

			if(response.status != 204) throw response.status; // TO DO - handle the status code

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const editUser = async function(user, newUsername) {
		try {
			const options = {
				method: 'PUT',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				},
				body: JSON.stringify({
					"name": newUsername
				})
			};

			const response = await fetch(core_url + '/api/users', options);

			if(response.status != 204) throw response.status; // TO DO - handle the status code

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadUser = async function(tokens) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'Authorization': tokens.token_type + ' ' + tokens.access_token
				}
			};

			return await coreRequest('/api/users', 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const refreshAccessToken = async function(user) {
		try {

			const options = {
				method: 'POST',
				headers: {
					'Authorization': tokens.token_type + ' ' + tokens.access_token
				},
				body: JSON.stringify({
					"grant_type": "refresh_token",
					"refresh_token": user.refresh_token,
					"client_id": client_id,
					"client_secret": client_secret
				})
			};

			return await coreRequest('/api/auth/token', 200, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const revokeAccessToken = async function(user) {
		try {

			const options = {
				method: 'DELETE',
				headers: {
					'Authorization': read_token
				},
				body: JSON.stringify({
					"token": user.access_token,
					"client_id": client_id,
					"client_secret": client_secret
				})
			};

			return await coreRequest('/api/auth/revoke', 204, options);

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 403:
					throw internalErrors.EXPIRED_ACCESS_TOKEN;
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

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
		saveUserChosenCoursesAndClasses : saveUserChosenCoursesAndClasses,
		loadUserSubscribedCourses : loadUserSubscribedCourses,
		loadUserSubscribedClassesInCourse : loadUserSubscribedClassesInCourse,
		deleteUserClass : deleteUserClass,
		deleteUserCourse : deleteUserCourse,
		editUser : editUser,
		loadUser : loadUser,
		refreshAccessToken : refreshAccessToken,
		revokeAccessToken : revokeAccessToken
	};

}