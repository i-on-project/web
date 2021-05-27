'use strict'

const data = require('./core-data.js')();

module.exports = function() {

	const loadAllProgrammes = async function () {
		const receivedData = await data.loadAllProgrammes();

		return receivedData.entities.map(entities => entities.properties);
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		const receivedData = await data.loadAllProgrammeOffers(programmeId);

		return receivedData.entities.map(entities => entities.properties);
	};

	const loadProgrammeData = async function(programmeId) {
		const receivedData = await data.loadProgrammeData(programmeId);
	
		return receivedData.properties;
	};

	const loadCourseClassesByCalendarTerm = async function(courseId) {
		const receivedData = await data.loadCourseClassesByCalendarTerm(courseId);
		const courseData = receivedData.entities.find(__ => __).properties;
		const course = {
			'courseId' : courseData.courseId,
			'acronym' : courseData.acronym,
			'name' : courseData.name,
			'classes': []
		} 

		return receivedData.entities.map(entity => entity.properties)
		.reduce(function(newResponse, currentClass) {
			newResponse.classes.push(currentClass.id);
			return newResponse;
		  }, course);
	}
	
	const loadAboutData = async function () {
		return await data.loadAboutData();
	};

	/******* Authentication *******/ 

	const loadAuthenticationTypes = async function () {

		const receivedData = await data.loadAuthenticationTypes();
		const auth_types = receivedData.map(method => method.type);

		return {
			"auth_types" : auth_types
		};
	};

	const loadAuthenticationMethodFeatures = async function () {

		const receivedData = await data.loadAuthenticationMethodFeatures();
		const auth_methods = receivedData.map(method => {
			return {
				"allowed_domains": method.allowed_domains,
				"type": method.type
			};
		});

		return {
			"auth_methods" : auth_methods
		};
	};

	const submitInstitutionalEmail = async function(email) {
		const receivedData = await data.submitInstitutionalEmail(email);
		
		return {
			"auth_req_id": receivedData.auth_req_id,
			"expires_in": receivedData.expires_in
		}
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadAuthenticationTypes : loadAuthenticationTypes,
		loadAuthenticationMethodFeatures : loadAuthenticationMethodFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail
	};
}