'use strict'

module.exports = function(data) {

	const loadAllProgrammes = async function () {
		
		const response = await data.loadAllProgrammes();


		/*** Adding missing data ***/
		const mockDataToBeAdded = await getMockData('/programmes');
		
		const improvedData = response
		.map( programme => {
			const mockProgramme = mockDataToBeAdded
			.find( mockProgramme => mockProgramme.programmeId == programme.programmeId);

			programme["name"] = mockProgramme.name;
			programme["degree"] = mockProgramme.degree;

			return programme;
		});
		
		return improvedData;
	};

	const loadAllProgrammeOffers = async function (programmeId) {
		const response = await data.loadAllProgrammeOffers(programmeId);

		/* Adding missing data */ 
		const path = '/offers/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);

		const improvedResponse = response.map( offer => {
			const mockOffer = mockDataToBeAdded
			.find( mockOffer => mockOffer.courseId == offer.courseId);

			offer["name"] = mockOffer.name;
			offer["acronym"] = mockOffer.acronym;
			offer["optional"] = mockOffer.optional;
			offer["ects"] = mockOffer.ects;
			offer["scientificArea"] = mockOffer.scientificArea;
			return offer;
		})

		return improvedResponse;
	};

	const loadProgrammeData = async function (programmeId) {
		const response = await data.loadProgrammeData(programmeId);
	
		/* Adding missing data */
		const path = '/programmes/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);
		
		// TO DO - Change
		response.name = mockDataToBeAdded.name;
		response["department"] = mockDataToBeAdded.department;
		response["department"] = mockDataToBeAdded.department;
		response["coordination"] = mockDataToBeAdded.coordination;
		response["contacts"] = mockDataToBeAdded.contacts;
		response["sourceLink"] = mockDataToBeAdded.sourceLink;
		response["description"] = mockDataToBeAdded.description;

		return response;
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const response = await data.loadCourseClassesByCalendarTerm(courseId, calendarTerm) ;

		/* Adding missing data */
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/class';
		const mockDataToBeAdded = await getMockData(path);

		response['name'] = mockDataToBeAdded.name;
		return response;
	}

	const loadAboutData = async function () {
		let response = await data.loadAboutData();

		/* Adding missing data */ 
		response = await getMockData('/i-on-team');

		return response;
	};

	const loadClassSectionSchedule = function(courseId, calendarTerm, classSection) {
		return data.loadClassSectionSchedule(courseId, calendarTerm, classSection);
	}

	const loadCourseEventsInCalendarTerm = function(courseId, calendarTerm) {
		return data.loadCourseEventsInCalendarTerm(courseId, calendarTerm);
	}

	const loadCurrentCalendarTerm = async function() {
		let response = await data.loadCurrentCalendarTerm();

		/* Adding missing data */ 
		response = await getMockData('/current_calendar_term');

		return response;
	}
	
	const loadCalendarTermGeneralInfo = async function(calendarTerm) {
		let response = await data.loadCalendarTermGeneralInfo(calendarTerm);

		/* Adding missing data */ 
		response = await getMockData('/calendarTerms/' + calendarTerm + '/semester_calendar');

		return response;
	}

	/* Authentication related methods */

	const loadAuthenticationMethodsAndFeatures = function () {
		return data.loadAuthenticationMethodsAndFeatures();
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
	
	const loadUser = function(access_token, token_type) {
		return data.loadUser(access_token, token_type);
	}

	const deleteUser = function(access_token, token_type) {
		return data.deleteUser(access_token, token_type);
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

const mockDataPath = '../../mock-data';
const getMockData = async function(path) {
	return require(mockDataPath + path);
};