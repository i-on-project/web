'use strict'

const internalErrors = require('../../common/i-on-web-errors.js');
const fetch = require('node-fetch'); 

const contentType = 'application/json';

/// Environment variables
const read_token = 'Bearer ' + process.env.CORE_READ_TOKEN;
const core_url = process.env.CORE_URL;
const client_id = process.env.CORE_CLIENT_ID;
const client_secret = process.env.CORE_CLIENT_SECRET;

module.exports = function() {

	/* Methods to load general academic information */

	const loadAllProgrammes = async function (metadata) {
		try {
			
			const options = {
				method: 'GET',
				headers: { 
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/programmes/', options);	
		
			return await verifyResponseStatus(response);

		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

	const loadProgramme = async function (programmeId, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: { 
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/programmes/'+ programmeId, options);	
			
			return await verifyResponseStatus(response);

		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

	const loadClassByCalendarTerm = async function(courseId, calendarTerm, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
		
			const response = await fetch(core_url + '/api/courses/' + courseId + '/classes/' + calendarTerm, options);	
			
			return await verifyResponseStatus(response);

		} catch (err) {		/// Error handling
			translateCoreError(err);
		}
	}
	
	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection, metadata) {
		try {

			/*
				Since core has changed after delivery and there are some inconsistencies with the previous versions, 
				for the final demo we decided use mock data on the parts that have changed
 			*/
			 return {
				"metadata": new Map(),
				"data": {}
			}

			/*const options = {
				method: 'GET',
				headers: {
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Accept': 'application/vnd.siren+json'
				}
			};
			
			const response = await fetch(core_url + '/api/courses/'+ courseId +'/classes/' + calendarTerm + '/' + classSection + '/calendar', options);	
			
			return await verifyResponseStatus(response);*/

		} catch (err) {		/// Error handling
			translateCoreError(err);
		}
	};
	
	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm, metadata) {
		try {
			
			/*
				Since core has changed after delivery and there are some inconsistencies with the previous versions, 
				for the final demo we decided use mock data on the parts that have changed
 			*/
			return {
				"metadata": new Map(),
				"data": {}
			}
			

			/*const options = {
				method: 'GET',
				headers: {
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Accept': 'application/vnd.siren+json'
				}
			};
			
			const response = await fetch(core_url + '/api/courses/'+ courseId +'/classes/' + calendarTerm + '/calendar', options);	
			
			return await verifyResponseStatus(response);*/
			
		} catch (err) {		/// Error handling
			translateCoreError(err);
		}
	};
	
	const loadAboutData = async function (metadata) {
		/// Request still not suported by i-on Core (its data is filled in add missing data module)
		try {
		
			return {
				"metadata": new Map(),
				"data": {}
			};
		
		} catch(err) { /// Although the request is not yet supported by the core, there is already a possible error checking for when the request is implemented 
			translateCoreError(err);
		}
	};

	const loadCalendarTerm = async function(metadata) {
		try {		
			const options = {
				method: 'GET',
				headers: {
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
			
			const response = await fetch(core_url + '/api/calendar-terms', options);	
			
			return await verifyResponseStatus(response);

		} catch(err) {	/// Although the request is not yet supported by the core, there is already a possible error checking for when the request is implemented 
			translateCoreError(err);
		}
	};
	
	const loadCalendarTermGeneralInfo = async function(calendarTerm, metadata) {
		try {
			
			const options = {
				method: 'GET',
				headers: {
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
			
			const response = await fetch(core_url + '/api/calendar-terms/' + calendarTerm, options);	
			
			return await verifyResponseStatus(response);

		} catch(err) {	/// Although the request is not yet supported by the core, there is already a possible error checking for when the request is implemented 
			translateCoreError(err);
		}
	};

	
	/* Methods related to authentication procedure */

	const loadAuthenticationMethodsAndFeatures = async function (metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'If-None-Match': metadata,
					'Authorization': read_token,
					'Content-Type': contentType
				}
			};
			
			const response = await fetch(core_url + '/api/auth/methods', options);	

			return await verifyResponseStatus(response);

		} catch(err) {		/// Error handling
			translateCoreError(err);
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

		} catch(err) {		/// Error handling
			translateCoreError(err);
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
			if(response.status != 200 && response.status != 400) throw response.status;
			return response.json();

		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};


	/* Methods related to user api */

	const saveUserSubscriptions = async function(user, id, classSection) {
		try {
			const options = {
				method: 'PUT',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/users/classes/' + id + '/' + classSection, options);
		
			if(response.status != 201 && response.status != 204) throw response.status;

		} catch(err) {		/// Error handling
			translateCoreError(err);
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

		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

	const getUserSubscriptions = async function(user) {
		try {
			const options = {
				method: 'GET',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			return await coreRequest('/api/users/sections', 200, options);

		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

	const deleteUserSubscriptions = async function(user, id, classSection) {
		try {
			const options = {
				method: 'DELETE',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
					'Content-Type': contentType
				}
			};

			const response = await fetch(core_url + '/api/users/classes/' + id + '/' + classSection, options);
	
			if(response.status != 204) throw response.status;

		} catch(err) {		/// Error handling
			translateCoreError(err);
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

			if(response.status != 204) throw response.status;

		} catch(err) {		/// Error handling
			translateCoreError(err);
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
			
			if(response.status != 204) throw response.status;

		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

	const loadUser = async function(access_token, token_type, email, metadata) {
		try {

			const options = {
				method: 'GET',
				headers: {
					'If-None-Match': metadata,
					'Authorization': token_type + ' ' + access_token
				}
			};

			const response = await fetch(core_url + '/api/users', options);	

			return await verifyResponseStatus(response);

		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

	const deleteUser = async function(user) {
		try {

			const options = {
				method: 'DELETE',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token
				}
			};

			const response = await fetch(core_url + '/api/users', options);
			
			if(response.status != 204) throw response.status;
			
		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

	const refreshAccessToken = async function(user) {
		try {

			const options = {
				method: 'POST',
				headers: {
					'Authorization': user.token_type + ' ' + user.access_token,
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

		} catch(err) {		/// Error handling
			translateCoreError(err);
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
		
		} catch(err) {		/// Error handling
			translateCoreError(err);
		}
	};

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

		/* Methods related to authentication procedure */
		loadAuthenticationMethodsAndFeatures : loadAuthenticationMethodsAndFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore,

		/* Methods related to user api */
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

/******* Helper functions ******/
const coreRequest = async function(endpoint, expectedStatus, options) {
	const response = await fetch(core_url + endpoint, options);
	if(response.status != expectedStatus) throw response.status;
	
	return response.json();
};

const translateCoreError = function(err) {
	console.log("[core-data.js] - Error : " + err);
	switch (err) {
		case 400:	/// Bad request
			throw internalErrors.BAD_REQUEST;
		case 403:	/// The access token has expired and this exception will be catched, consequently, the access token will be refreshed
			throw internalErrors.EXPIRED_ACCESS_TOKEN;
		case 404:	/// Not Found
			throw internalErrors.RESOURCE_NOT_FOUND;
		case 503:	/// Service Unavailable
			throw internalErrors.SERVICE_UNAVAILABLE;
		default:	/// Internal Server Error
			throw internalErrors.SERVICE_FAILURE;
	}
}

const verifyResponseStatus = async function(response) {
	if(response.status === 200) {
		return {
			"metadata": response.headers,
			"data": await response.json()
		}
	} else if(response.status === 304) {
		return {
			"metadata": response.headers
		}
	} else {
		throw response.status;
	}
}