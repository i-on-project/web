'use strict'

module.exports = function(data, myCache) {

	const loadAllProgrammes = async function() {

		const key = "programmes";

		const fetchFunction = function() {
			return data.loadAllProgrammes(...arguments);
		}
		console.log('cache - loadAllProgrammes')
		return getData(myCache, key, fetchFunction);

	};

	const loadAllProgrammeOffers = async function (programmeId) {
		
		const key = 'offers/' + programmeId;

		const fetchFunction = function() { 
			return data.loadAllProgrammeOffers(programmeId, ...arguments);
		}
		console.log('cache - loadAllProgrammeOffers')
		return getData(myCache, key, fetchFunction);
	};

	const loadProgrammeData = async function(programmeId) {
	
		const key = 'programme/' + programmeId;

		const fetchFunction = function() { 
			return data.loadProgrammeData(programmeId, ...arguments);
		}
		console.log('cache - loadProgrammeData')
		return getData(myCache, key, fetchFunction);
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const key = courseId + '/' + calendarTerm;

		const fetchFunction = function() { 
			return data.loadCourseClassesByCalendarTerm(courseId, calendarTerm, ...arguments);
		}
		console.log('cache - loadCourseClassesByCalendarTerm')
		return getData(myCache, key, fetchFunction);
	};

	const loadAboutData = async function () {
		const key = 'about';

		const fetchFunction = function() {
			return data.loadAboutData(...arguments);
		}
		console.log('cache - loadAboutData')
		return getData(myCache, key, fetchFunction);
	};

	const loadClassSectionSchedule = function(courseId, calendarTerm, classSection) {
		const key = calendarTerm + '/' + courseId + '/' + classSection;

		const fetchFunction = function() {
			return data.loadClassSectionSchedule(courseId, calendarTerm, classSection, ...arguments);
		}
		
		return getData(myCache, key, fetchFunction);
	};
	
	const loadCourseEventsInCalendarTerm = function(courseId, calendarTerm) {
		const key = calendarTerm + '/' + courseId;

		const fetchFunction = function() {
			return data.loadCourseEventsInCalendarTerm(courseId, calendarTerm, ...arguments);
		}
		
		return getData(myCache, key, fetchFunction);
	};
	
	const loadCurrentCalendarTerm = async function() {
		const key = 'currentCalendarTerm';

		const fetchFunction = function() {
			return data.loadCurrentCalendarTerm(...arguments);
		}
		
		return getData(myCache, key, fetchFunction);
	};
		
	const loadCalendarTermGeneralInfo = async function(calendarTerm) {
		const key = 'CalendarTermInfo';

		const fetchFunction = function() { 
			return data.loadCalendarTermGeneralInfo(calendarTerm, ...arguments);
		}
		
		return getData(myCache, key, fetchFunction);
	};

	/* Authentication related methods */
	const loadAuthenticationMethodsAndFeatures = function () {
		const key = 'CalendarTermInfo';

		const fetchFunction = function() {
			return data.loadAuthenticationMethodsAndFeatures(...arguments);
		}
		
		return getData(myCache, key, fetchFunction);
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
	};
	
	const loadUserSubscribedClassSectionsInClass = function(user, id) {
		return data.loadUserSubscribedClassSectionsInClass(user, id);
	};
	
	const loadUserSubscribedClassesAndClassSections = function(user) {
		return data.loadUserSubscribedClassesAndClassSections(user);
	};
	
	const deleteUserClassSection = function(user, id, classSection) {
		return data.deleteUserClassSection(user, id, classSection);
	};
	
	const deleteUserClass = function(user, id) {
		return data.deleteUserClass(user, id);
	};
	
	const editUser = function(user, newUsername) {
		const key = 'user/' + user.email;
		myCache.del(key);
		return data.editUser(user, newUsername);
		//tira o valor deste user da cache
	};
	
	const loadUser = function(access_token, token_type, email) {
		const key = 'user/' + email;

		const fetchFunction = function() {
			return data.loadUser(access_token, token_type, email, ...arguments);
		}
		
		return getData(myCache, key, fetchFunction);
	};
	
	const deleteUser = function(user) {
		const key = 'user/' + user.email;
		myCache.del(key);
		return data.deleteUser(user);
	};
	
	const refreshAccessToken = function(user) {
		return data.refreshAccessToken(user);
	};
	
	const revokeAccessToken = function(user) {
		return data.revokeAccessToken(user);
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


/******* Helper functions *******/

const getData = async function(myCache, key, fetchNewData) {

	let value = myCache.get(key);

	if(!value) {										/// Value does not exists

		console.log("\n[Cache] - Value does not exists")
		
		value = await fetchNewData();
	
		myCache.set(key, value, value.metadata.maxAge);

	} else if (myCache.hasExpired(key)) {				/// Value already exists but expired -> conditional request

		console.log("\n[Cache] - Value already exists but expired -> conditional request")
		
		const resp = await fetchNewData.apply(this, [value.metadata.ETag]);

		if(resp) {	/// The resource has been modified since the given date
			value = resp;
			myCache.set(key, value, value.metadata.maxAge);
		} else {	/// The resource has not been modified since the given date, reset ttl to the initial value
			myCache.ttl(key, resp.metadata.maxAge);
		}

	} else {
		console.log("\n[Cache] - Value exists")
	}

	//console.log('\n[Cache] - stored in cache: ' + JSON.stringify(value));
	return value;

}