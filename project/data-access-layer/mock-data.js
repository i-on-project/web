'use strict'

let users = {};
const mock_users_limit = 3;

module.exports = function() {

	const loadAllProgrammes = async function() {
		const data = await getMockData('/programmes');
		return data? data : [];
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		const path = '/offers/' + programmeId;
		const data = await getMockData(path);
		return data? data : [];
	};

	const loadProgrammeData = async function(programmeId) {
		const path = '/programmes/' + programmeId;
		const data = await getMockData(path);
		return data ? data : {};
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/class';
		const data = await getMockData(path);
		return data? {
			"courseId": data.courseId,
			"acronym": data.acronym,
			"name": data.name,
			"classes": data.classes
		} : {};
	};

	const loadAboutData = async function() {
		const data = await getMockData('/i-on-team');
		return data? data : {};
	};
	
	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/classSections/' + classSection;
		const data = await getMockData(path);
		return data? data : [];
	}

	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm) {
		const path = '/calendarTerms/' + calendarTerm + '/' + courseId + '/events';
		const data = await getMockData(path);
		return data? data : {};
	}

	const loadCurrentCalendarTerm = async function() {
		const path = '/current_calendar_term';
		const data = await getMockData(path);
		return data? data.calendarTerm : {};
	}
		
	const loadCalendarTermGeneralInfo = async function(calendarTerm) {
		const path = '/calendarTerms/' + calendarTerm + '/semester_calendar';
		const data = await getMockData(path);
		return data? data : [];
	}

	/* Authentication related methods */

	const loadAuthenticationMethodsAndFeatures = async function () {
		const path = '/auth/authenticationMethodsAndFeatures';
		return getMockData(path);
	};

	const submitInstitutionalEmail = async function(email) {
		if(Object.keys(users).length < mock_users_limit) {
			if(!users.hasOwnProperty(email)) {
				users[`${email}`] = {
					"email": email,
					"username": email.slice(0, email.indexOf("@")),
					"coursesAndClasses": []
				};
			}
		}
		return {
			"auth_req_id": email,
			"expires_in": 20
		};
	};

	const pollingCore = async function(authForPoll) {
		return Object.keys(users).length < mock_users_limit || users.hasOwnProperty(authForPoll) ?  
			{
			 "access_token": authForPoll,
			 "token_type": ""
			} 
			: 
			{};
	};

	/* User related methods */

	const saveUserClassesAndClassSections = async function(user, courseId, classSection) { 
		const path = '/user-courses/' + courseId;
		const data = await getMockData(path);

		if(data) {
			for(let i = 0; i < users[user.email].coursesAndClasses.length; i++) {
				if(users[user.email].coursesAndClasses[i].courseId == courseId)
					users[user.email].coursesAndClasses[i].classes.push(classSection);
			} 
			if(users[user.email].coursesAndClasses.length == 0) {
				const course = data;
				course['classes'] = [classSection];
				users[user.email].coursesAndClasses.push(course);
			}
		};
	}

	const loadUserSubscribedClassesAndClassSections = async function(user) {
		return users[user.email].coursesAndClasses;
	}

	const loadUserSubscribedClassSectionsInClass = async function(user, courseId) { 
		return users[user.email].coursesAndClasses.filter(course => course.courseId == courseId).find(__ => __).classes;
	}

	const deleteUserClassSection = async function(user, courseId, classSection) {
		const classSections = users[user.email].coursesAndClasses
		.filter(course => course.courseId == courseId).find(__ => __).classes;

		const classSectionsSize = classSections.length;

		for( let i = 0; i < classSectionsSize; i++){ 
			if ( classSections[i] == classSection) { 
				users[user.email].coursesAndClasses
				.filter(course => course.courseId == courseId)
				.find(__ => __).classes.splice(i, 1); 
			}
		}
	}

	const deleteUserClass = async function(user, courseId) {
		for( let i = 0; i < users[user.email].coursesAndClasses.length; i++){ 
			if ( users[user.email].coursesAndClasses[i].courseId == courseId) { 
				users[user.email].coursesAndClasses.splice(i, 1); 
			}
		}
	}

	const editUser = async function(user, newUsername) {
		users[user.email].username = newUsername;
	}

	const loadUser = async function(access_token, token_type) {
		return users[access_token];
	}

	const deleteUser = async function(access_token, token_type) {
		delete users[access_token];
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
		deleteUser : deleteUser
	};
}

/******* Helper functions *******/

const mockDataPath = '../mock-data';
const getMockData = async function(path) {
	try{
		return require(mockDataPath + path);
	} catch(err) {
		return undefined;
	}
};