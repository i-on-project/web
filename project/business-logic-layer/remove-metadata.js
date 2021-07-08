'use strict'

module.exports = function(data) {

    const loadAllProgrammes = async function () {
		const receivedData = await data.loadAllProgrammes();
		return receivedData.data;
	};

    const loadAllProgrammeOffers = async function (programmeId) {
		const receivedData = await data.loadAllProgrammeOffers(programmeId);
		return receivedData.data;
	};

	const loadProgrammeData = async function(programmeId) {
		const receivedData = await data.loadProgrammeData(programmeId);
		return receivedData.data;
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const receivedData = await data.loadCourseClassesByCalendarTerm(courseId, calendarTerm);
		return receivedData.data;
	};
	
	const loadAboutData = async function () {	
		console.log('metadata - loadAboutData')
		const receivedData = await data.loadAboutData();
		return receivedData.data;
	};
	
	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection) {
		const receivedData = await data.loadClassSectionSchedule(courseId, calendarTerm, classSection);
		return receivedData.data;
	};
	
	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm) {
		const receivedData = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm);
		return receivedData.data;
	};
	
	const loadCurrentCalendarTerm = async function() {
		const receivedData = await data.loadCurrentCalendarTerm();
		return receivedData.data;
	};
		
	const loadCalendarTermGeneralInfo = async function(calendarTerm) {
		const receivedData = await data.loadCalendarTermGeneralInfo(calendarTerm);
		return receivedData.data;
	};

	/* Authentication related methods */
	const loadAuthenticationMethodsAndFeatures = async function () {
		const receivedData = await data.loadAuthenticationMethodsAndFeatures();
		return receivedData.data;
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
		return data.editUser(user, newUsername);
	};
	
	const loadUser = async function(access_token, token_type, email) {
		const receivedData = await data.loadUser(access_token, token_type, email);
		return receivedData.data;
	};
	
	const deleteUser = function(user) {
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
