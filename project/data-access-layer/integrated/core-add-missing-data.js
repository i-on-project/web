'use strict'

const default_maxAge = 24 * 60 * 60;
const defaulEtag = 'Etag';

module.exports = function(data) {

	const loadAllProgrammes = async function (metadata) {

		const response = await data.loadAllProgrammes(metadata);

		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 

		/*** Adding data ***/
		const mockDataToBeAdded = await getMockData('/programmes');

		const improvedData = response.data
		.map( programme => {
			const mockProgramme = mockDataToBeAdded
			.find( mockProgramme => mockProgramme.programmeId == programme.programmeId);

			programme["name"] = mockProgramme.name;
			programme["degree"] = mockProgramme.degree;

			return programme;
		});
		
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}

		return {
			"metadata": improvedMetadata,
			"data": improvedData
		};
	};

	const loadProgramme = async function (programmeId, metadata) {
		const response = await data.loadProgramme(programmeId, metadata);

		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 

		/* Adding missing data */ 
		const path = '/programmes/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);

		const offers = response.data.offers  
		.filter( offer => { 	// Due to core inconsistencies we verify if the returned offers are actually part of the programme curricular plan, 

			const mockOffer = mockDataToBeAdded.offers		// this filter can be removed when the Core inconsistency is resolved
				.find( mockOffer => mockOffer.courseId == offer.courseId);

			return mockOffer;
		 })
		.map( offer => {

			const mockOffer = mockDataToBeAdded.offers
				.find( mockOffer => mockOffer.courseId == offer.courseId);
	
			offer["name"] = mockOffer.name;
			offer["acronym"] = mockOffer.acronym;
			offer["optional"] = mockOffer.optional;
			offer["ects"] = mockOffer.ects;
			offer["scientificArea"] = mockOffer.scientificArea;

			return offer;
		});

		const improvedData = {
			"id": response.data.id,
			"name": response.data.name,
			"acronym": mockDataToBeAdded.acronym,
			"termSize": response.data.termSize,
			"department": mockDataToBeAdded.department,
			"coordination": mockDataToBeAdded.coordination,
			"contacts": mockDataToBeAdded.contacts,
			"sourceLink": mockDataToBeAdded.sourceLink,
			"description": mockDataToBeAdded.description,
			"offers" : offers
		}

		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
		
		return {
			"metadata": improvedMetadata,
			"data": improvedData
		};
	};

	const loadClassByCalendarTerm = async function(courseId, calendarTerm, metadata)  {
	
		const response = await data.loadClassByCalendarTerm(courseId, calendarTerm, metadata) ;

		if(!response.hasOwnProperty('data')) return response; // The resource has not been modified 

		/* Adding missing data */
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/class';

		const mockDataToBeAdded = await getMockData(path);

		const improvedData = response.data;
		if(mockDataToBeAdded) improvedData['name'] = mockDataToBeAdded.name;
	
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
		
		return {
			"metadata": improvedMetadata,
			"data": improvedData
		};
	}

	const loadAboutData = async function (metadata) {
		const response = await data.loadAboutData(metadata);
		
		if(!response.hasOwnProperty('data')) return response; // The resource has not been modified 
		
		/* Adding missing data */ 
		const improvedData = await getMockData('/i-on-team');

		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
		
		return {
			"metadata": improvedMetadata,
			"data": improvedData
		};
	};



	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection, metadata) { 
		const response = await data.loadClassSectionSchedule(courseId, calendarTerm, classSection, metadata);

		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 
		
		/* Adding missing data */
		/*
			Since core has changed after delivery and there are some inconsistencies with the previous versions, 
			for the final demo we decided use mock data on the parts that have changed
		*/
		const improvedData = await getMockData('/calendarTerms/' + calendarTerm + '/' + courseId + '/classSections/' + classSection);
		
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
		
		return {
			"metadata": improvedMetadata,
			"data": improvedData /// response.data
		};
	}

	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm, metadata) {
		const response = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm, metadata);

		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 
				
		/* Adding missing data */ 
		/*
			Since core has changed after delivery and there are some inconsistencies with the previous versions, 
			for the final demo we decided use mock data on the parts that have changed
		*/
		const improvedData = await getMockData('/calendarTerms/' + calendarTerm + '/' + courseId + '/events');

		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
		
		return {
			"metadata": improvedMetadata,
			"data": improvedData /// response.data
		};
	}

	const loadCalendarTerm = async function(metadata) {
		const response = await data.loadCalendarTerm(metadata);

		/* Adding missing data */ 
		/*
			Since core has changed after delivery and there are some inconsistencies with the previous versions, 
			for the final demo we decided use mock data on the parts that have changed
		*/
		const improvedData = {
			"currentCalendarTerm": "1718i"
		};
	
		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 
				
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
	
		return {
			"metadata": improvedMetadata,
			"data": improvedData /// response.data
		};
	}
	
	const loadCalendarTermGeneralInfo = async function(calendarTerm, metadata) {
		const response = await data.loadCalendarTermGeneralInfo(calendarTerm, metadata);
		
		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 

		/* Adding missing data */ 
		const mockDataToBeAdded = await getMockData('/calendarTerms/' + calendarTerm + '/semester_calendar');

		const improvedData = response.data.map(season => {
			const mockSeason = mockDataToBeAdded.find(mockSeason => ( mockSeason.date === season.date && mockSeason.id === season.id)) 
			
			return {
				"date": season.date,
				"title": mockSeason.title,
			  	"description": mockSeason.description
			}
		})

		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}

		return {
			"metadata": improvedMetadata,
			"data": improvedData
		};
	}

	/* Authentication related methods */

	const loadAuthenticationMethodsAndFeatures = async function (metadata) {
		const response = await data.loadAuthenticationMethodsAndFeatures(metadata);
		if(!response.hasOwnProperty('data')) return response; // The resource has not been modified 

		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}

		return {
			"metadata": improvedMetadata,
			"data": response.data
		};
	};

	const submitInstitutionalEmail = function(email) {
		return data.submitInstitutionalEmail(email);
	};

	const pollingCore = function(authForPoll) {
		return data.pollingCore(authForPoll);
	};

	/* User related methods */

	
	const saveUserSubscriptions = function(user, id, classSection) {
		return data.saveUserSubscriptions(user, id, classSection);
	}

	const loadUserSubscribedClassSectionsInClass = function(user, id) {
		return data.loadUserSubscribedClassSectionsInClass(user, id);
	}

	const getUserSubscriptions = function(user) {
		return data.getUserSubscriptions(user);
	}

	const deleteUserSubscriptions = function(user, id, classSection) {
		return data.deleteUserSubscriptions(user, id, classSection);
	}
	
	const deleteUserClass = function(user, id) {
		return data.deleteUserClass(user, id);
	}
	
	const editUser = function(user, newUsername) {
		return data.editUser(user, newUsername);
	}
	
	const loadUser = async function(access_token, token_type, email, metadata) {
		const response = await data.loadUser(access_token, token_type, email, metadata);

		if(!response.hasOwnProperty('data')) return response; // The resource has not been modified 
				
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": 5 * 60
		}
		
		return {
			"metadata": improvedMetadata,
			"data": response.data
		};
	}

	const deleteUser = function(user) {
		return data.deleteUser(user);
	}

	const refreshAccessToken = function(user) {
		return data.refreshAccessToken(user);
	}

	const revokeAccessToken = function(user) {
		return data.revokeAccessToken(user);
	}

	return {
		loadAllProgrammes : loadAllProgrammes,
		loadProgramme : loadProgramme,
		loadClassByCalendarTerm : loadClassByCalendarTerm,
		loadAboutData : loadAboutData,
		loadClassSectionSchedule : loadClassSectionSchedule,
		loadCourseEventsInCalendarTerm : loadCourseEventsInCalendarTerm,
		loadCalendarTerm : loadCalendarTerm,
		loadCalendarTermGeneralInfo : loadCalendarTermGeneralInfo,

		/* Authentication related methods */
		loadAuthenticationMethodsAndFeatures : loadAuthenticationMethodsAndFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore,

		/* User related methods */
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

const mockDataPath = '../../mock-data/integrated';
const getMockData = async function(path) {
	return require(mockDataPath + path);
};