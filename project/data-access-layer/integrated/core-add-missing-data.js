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

	const loadAllProgrammeOffers = async function (programmeId, metadata) {
		const response = await data.loadAllProgrammeOffers(programmeId, metadata);

		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 

		/* Adding missing data */ 
		const path = '/offers/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);

		const improvedData = response.data  
		.filter( offer => { 						// Due to core inconsistencies we verify if the returned offers are actually part of the programme curricular plan, 
			const mockOffer = mockDataToBeAdded		// this filter can be removed when the Core inconsistency is resolved
				.find( mockOffer => mockOffer.courseId == offer.courseId);

			return mockOffer;
		 })
		.map( offer => {
			const mockOffer = mockDataToBeAdded
				.find( mockOffer => mockOffer.courseId == offer.courseId);
	
			offer["name"] = mockOffer.name;
			offer["acronym"] = mockOffer.acronym;
			offer["optional"] = mockOffer.optional;
			offer["ects"] = mockOffer.ects;
			offer["scientificArea"] = mockOffer.scientificArea;

			return offer;
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

	const loadProgrammeData = async function (programmeId, metadata) {
		
		const response = await data.loadProgrammeData(programmeId, metadata);
	
		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 

		/* Adding missing data */
		const path = '/programmes/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);

		const improvedData = {
			"id": response.data.id,
			"name": mockDataToBeAdded.name,
			"department": mockDataToBeAdded.department,
			"coordination": mockDataToBeAdded.coordination,
			"contacts": mockDataToBeAdded.contacts,
			"sourceLink": mockDataToBeAdded.sourceLink,
			"description": mockDataToBeAdded.description
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

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm, metadata)  {
	
		const response = await data.loadCourseClassesByCalendarTerm(courseId, calendarTerm, metadata) ;
		
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
		console.log(JSON.stringify(response));
		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 
				
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
		
		return {
			"metadata": improvedMetadata,
			"data": response.data
		};
	}

	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm, metadata) {
		const response = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm, metadata);

		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 
				
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
		
		return {
			"metadata": improvedMetadata,
			"data": response.data
		};
	}

	const loadCalendarTerm = async function(metadata) {
		const response = await data.loadCalendarTerm(metadata);
	
		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 
				
		/*** Adding metadata ***/
		const improvedMetadata = {
			"ETag": defaulEtag,
			"maxAge": default_maxAge
		}
	
		return {
			"metadata": improvedMetadata,
			"data": response.data
		};
	}
	
	const loadCalendarTermGeneralInfo = async function(calendarTerm, metadata) {
		
		const response = await data.loadCalendarTermGeneralInfo(calendarTerm, metadata);
	
		if(!response.hasOwnProperty('data')) return response;	// The resource has not been modified 

		/* Adding missing data */ 
		const mockDataToBeAdded = await getMockData('/calendarTerms/' + calendarTerm + '/semester_calendar');
	
		const improvedData = response.data.map(season => {
	
			const mockSeason = mockDataToBeAdded.find(mockSeason => ( mockSeason.date === season.date && mockSeason.id === season.id )) 
	
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

	
	const saveUserClassesAndClassSections = function(user, id, classSection) {
		return data.saveUserClassesAndClassSections(user, id, classSection);
	}

	const loadUserSubscribedClassSectionsInClass = function(user, id) {
		return data.loadUserSubscribedClassSectionsInClass(user, id);
	}

	const loadUserSubscribedClassesAndClassSections = function(user) {
		return data.loadUserSubscribedClassesAndClassSections(user);
	}

	const deleteUserClassSection = function(user, id, classSection) {
		return data.deleteUserClassSection(user, id, classSection);
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
			"maxAge": 10 * 60
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
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
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

const mockDataPath = '../../mock-data/integrated';
const getMockData = async function(path) {
	return require(mockDataPath + path);
};