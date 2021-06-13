'use strict'

module.exports = function(data) {

	const loadAllProgrammes = async function () {
		console.log("AMD")
		const response = await data.loadAllProgrammes();
		console.log("AMD - response received")

		/*** Adding missing data ***/
		const mockDataToBeAdded = await getMockData('/programmes');
	
		const improvedData = response
		.map( programme => {
			const mockProgramme = mockDataToBeAdded.entities
			.find( mockEntities => mockEntities.properties.programmeId == programme.programmeId).properties;

			programme["name"] = mockProgramme.name;
			programme["degree"] = mockProgramme.degree;

			return programme;
		});

		console.log("AMD - returning")
		return improvedData;
	};

	const loadAllProgrammeOffers = async function (programmeId) {
		const response = await data.loadAllProgrammeOffers(programmeId);

		/* Adding missing data */ 
		const path = '/offers/' + programmeId;
		const mockDataToBeAdded = await getMockData(path);

		const improvedResponse = response.map( offer => {
			const mockOffer = mockDataToBeAdded.entities
			.find( mockEntities => mockEntities.properties.courseId == offer.courseId).properties;

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
		response.name = mockDataToBeAdded.properties.name;
		response["department"] = mockDataToBeAdded.properties.department;
		response["department"] = mockDataToBeAdded.properties.department;
		response["coordination"] = mockDataToBeAdded.properties.coordination;
		response["contacts"] = mockDataToBeAdded.properties.contacts;
		response["sourceLink"] = mockDataToBeAdded.properties.sourceLink;
		response["description"] = mockDataToBeAdded.properties.description;

		return response;
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const response = await data.loadCourseClassesByCalendarTerm(courseId, calendarTerm) ;

		/* Adding missing data */
		const path = '/courses/' + courseId;
		const mockDataToBeAdded = await getMockData(path);

		response['name'] = mockDataToBeAdded.entities.find(__ => __).properties.name;
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

	const saveUserChosenCoursesAndClasses = function(user, courseId, classSection) {
		return data.saveUserChosenCoursesAndClasses(user, courseId, classSection);
	}

	const loadUserSubscribedCourses = function(user) {
		return data.loadUserSubscribedCourses(user);
	}

	const loadUserSubscribedClassesInCourse = function(user, courseId) {
		return data.loadUserSubscribedClassesInCourse(user, courseId);
	}

	const deleteUserClass = function(user, courseId, classSection) {
		return data.deleteUserClass(user, courseId, classSection);
	}

	const deleteUserCourse = function(user, courseId) {
		return data.deleteUserCourse(user, courseId);
	}

	const editUser = function(user, newUsername) {
		return data.editUser(user, newUsername);
	}

	const loadUser = function(tokens) {
		return data.loadUser(tokens);
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

const mockDataPath = './mock-data';
const getMockData = async function(path) {
	return require(mockDataPath + path);
};