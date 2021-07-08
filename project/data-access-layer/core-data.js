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

	const loadAllProgrammes = async function (metadata) {
		try {
			
			const options = {
				method: 'GET',
				headers: { 
					'ETag': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/programmes/', options);	
			
			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404:	/// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default:	/// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadAllProgrammeOffers = async function (programmeId, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: { 
					'ETag': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/programmes/'+ programmeId, options);	

			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadProgrammeData = async function(programmeId, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'ETag': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/programmes/'+ programmeId, options);	

			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'ETag': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
		
			const response = await fetch(core_url + '/api/courses/'+ courseId +'/classes/' + calendarTerm, options);	
			
			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

		} catch (err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	}
	
	const loadAboutData = async function (metadata) {
		try {
		
			return {
				"metadata": {
					"ETag": undefined,
					"cache-control-max-age": undefined
				},
				"data": {}
			}; // Request still not suported by i-on Core

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'ETag': metadata,
					'Authorization': read_token,
					'Accept': 'application/vnd.siren+json'
				}
			};

			const response = await fetch(core_url + '/api/courses/'+ courseId +'/classes/' + calendarTerm + '/' + classSection + '/calendar', options);	

			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

		} catch (err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'ETag': metadata,
					'Authorization': read_token,
					'Accept': 'application/vnd.siren+json'
				}
			};

			const response = await fetch(core_url + '/api/courses/'+ courseId +'/classes/' + calendarTerm + '/calendar', options);	

			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

		} catch (err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};

	const loadCurrentCalendarTerm = async function(metadata) {
		try {
		
			return {
				"metadata": {},
				"data": {}
			}; // Request still not suported by i-on Core

		} catch(err) { /// TO DO:  Add more error handling
			switch (err) {
				case 404: /// Not Found
					throw internalErrors.RESOURCE_NOT_FOUND;
				default: /// Internal Server Error
					throw internalErrors.SERVICE_FAILURE;
			}
		}
	};
	
	const loadCalendarTermGeneralInfo = async function(calendarTerm, metadata) {
		try {
			return {
				"metadata": {},
				"data": {}
			}; // Request still not suported by i-on Core

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

	const loadAuthenticationMethodsAndFeatures = async function (metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'ETag': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
			
			const response = await fetch(core_url + '/api/auth/methods', options);	

			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

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

	const saveUserClassesAndClassSections = async function(user, id, classSection) {
		try {
			const options = {
				method: 'PUT',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/users/classes/' + id + '/' + classSection, options);
		
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

	const loadUserSubscribedClassSectionsInClass = async function(user, id) {
		try {
			const options = {
				method: 'GET',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/users/classes/' + id, 200, options);

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

	const loadUserSubscribedClassesAndClassSections = async function(user) {
		try {
			const options = {
				method: 'GET',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/users/sections', 200, options);

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

	const deleteUserClassSection = async function(user, id, classSection) {
		try {
			const options = {
				method: 'DELETE',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/users/classes/' + id + '/' + classSection, options);
	
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

	const deleteUserClass = async function(user, courseId) {
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

	const loadUser = async function(access_token, token_type, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'ETag': metadata,
					'Authorization': token_type + ' ' + access_token
				}
			};

			const response = await fetch(core_url + '/api/users', options);	

			if(response.status === 200) {
				return {
					"metadata": response.headers,
					"data": await response.json()
				}
			} else if(response.status === 204) {
				return {
					"metadata": response.headers
				}
			} else {
				throw response.status;
			}

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

	const deleteUser = async function(access_token, token_type) {
		try {

			const options = {
				method: 'DELETE',
				headers: {
					'Authorization': token_type + ' ' + access_token
				}
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

	const refreshAccessToken = async function(user) {
		try {

			const options = {
				method: 'POST',
				headers: {
					'Authorization': tokens.token_type + ' ' + tokens.access_token,
					'Content-Type': contentType
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
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				},
				body: JSON.stringify({
					"token": user.access_token,
					"client_id": client_id,
					"client_secret": client_secret
				})
			};

			const response = await fetch(core_url + '/api/auth/revoke', options);
			
			if(response.status != 204) throw response.status;
		
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