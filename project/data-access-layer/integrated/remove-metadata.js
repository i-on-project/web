'use strict'

module.exports = function(data) {

    const loadAllProgrammes = async function () {
		const receivedData = await data.loadAllProgrammes();
		return receivedData.data;
	};

    const loadProgramme = async function (programmeId) {
		const receivedData = await data.loadProgramme(programmeId);
		return receivedData.data;
	};

	const loadClassByCalendarTerm = async function(courseId, calendarTerm)  {
		const receivedData = await data.loadClassByCalendarTerm(courseId, calendarTerm);
		return receivedData.data;
	};
	
	const loadAboutData = async function () {	
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
	
	const loadCalendarTerm = async function() {
		const receivedData = await data.loadCalendarTerm();
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
	const saveUserSubscriptions = function(user, id, classSection) {
		return data.saveUserSubscriptions(user, id, classSection);
	};
	
	const loadUserSubscribedClassSectionsInClass = function(user, id) {
		return data.loadUserSubscribedClassSectionsInClass(user, id);
	};
	
	const getUserSubscriptions = function(user) {
		return data.getUserSubscriptions(user);
	};
	
	const deleteUserSubscriptions = function(user, id, classSection) {
		return data.deleteUserSubscriptions(user, id, classSection);
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
