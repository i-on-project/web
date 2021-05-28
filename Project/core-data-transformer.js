'use strict'

const data = require('./core-data.js')();

module.exports = function() {

	const loadAllProgrammes = async function () {
		console.log("\n[Tranformer] - Passing by...");
		const rawData = await data.loadAllProgrammes();

		/*** Metadata ***/
		const headers = rawData.headers;
		const metadata = {
			"lastModified" : headers.get('last-modified') /// TO DO: Convert to epoch 
		}

		/*** Data ***/
		const payload = await rawData.json();

		const transformedData = payload.entities
		.map(entities => entities.properties)
		.reduce(function(response, currentProgramme) {
			const programme = {
				"programmeId": currentProgramme.programmeId,
				"acronym": currentProgramme.acronym,
				"name": currentProgramme.name,
				"degree": currentProgramme.degree
			}
			response.push(programme);
			return response;
		}, []);
		console.log("\n[Tranformer] - Returning transformed data...");
		return {
			"data" : transformedData,
			"metadata" : metadata
		}
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		const receivedData = await data.loadAllProgrammeOffers(programmeId);

		return receivedData.entities
		.map(entities => entities.properties)
		.reduce(function(response, currentCourse) {
			const course = {
				"acronym": currentCourse.acronym,
				"name": currentCourse.name,
				"courseId": currentCourse.courseId,
				"id": currentCourse.id,
				"termNumber": currentCourse.termNumber,
				"optional": currentCourse.optional,
				"ects": currentCourse.ects,
				"scientificArea": currentCourse.scientificArea
			}
			response.push(course);
			return response;
		}, []);;
	};

	const loadProgrammeData = async function(programmeId) {
		const receivedData = await data.loadProgrammeData(programmeId);
	
		return {
			"id": receivedData.properties.id,
			"name": receivedData.properties.name,
			"acronym": receivedData.properties.acronym,
			"termSize": receivedData.properties.termSize,
			"department": receivedData.properties.department,
			"coordination": receivedData.properties.coordination,
			"contacts": receivedData.properties.contacts,
			"sourceLink": receivedData.properties.sourceLink,
			"description": receivedData.properties.description,
		};
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

	const pollingCore = async function(authForPoll) {
		const receivedData = await data.pollingCore(authForPoll);
		
		return receivedData.hasOwnProperty("access_token") ? 
		{
			"access_token": receivedData.access_token,
			"token_type": receivedData.token_type,
			"refresh_token": receivedData.refresh_token,
			"expires_in": receivedData.expires_in,
			"id_token": receivedData.id_token
		} :
		{
			"error" : receivedData.error,
			"error_description" : receivedData.error_description
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
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore
	};
}