'use strict'

const data = require('./core-data.js')();

module.exports = function() {

	const loadAllProgrammes = async function () {

		const receivedData = await data.loadAllProgrammes();

		const transformedData = receivedData.entities
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

		return transformedData;
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

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		const receivedData = await data.loadCourseClassesByCalendarTerm(courseId, calendarTerm) ;
		
		const courseData = receivedData.entities.find(__ => __).properties;
		const course = {
			'courseId' : courseData.courseId,
			'acronym' : courseData.acronym,
			'name' : courseData.name,
			'classes': []
		} 

		return receivedData.entities
		.filter(entity => entity.properties.hasOwnProperty('id'))
		.map(entity => entity.properties)
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

	const saveUserChosenCoursesAndClasses = function(user, courseId, classSection) {
		return data.saveUserChosenCoursesAndClasses(user, courseId, classSection);
	}

	const loadUserSubscribedCourses = async function(user) {
		const receivedData = await data.loadUserSubscribedCourses(user);

		return receivedData.entities		
		.map(entities => entities.properties)
		.reduce(function(response, currentCourse) {
			const course = {
				"id": currentCourse.id,
				"courseId": currentCourse.courseId,
				"acronym": currentCourse.courseAcr,
				"calendarTerm": currentCourse.calendarTerm
			}
			response.push(course);
			return response;
		}, []);
	}

	const loadUserSubscribedClassesInCourse = async function(user, courseId) {//entities.properties.sectionId
		const receivedData = await data.loadUserSubscribedClassesInCourse(user, courseId);

		return receivedData.entities		
		.map(entities => entities.properties)
		.reduce(function(response, currentClass) {
			response.push(currentClass.sectionId);
			return response;
		}, []);
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

	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection) {
		const receivedData = await data.loadClassSectionSchedule(courseId, calendarTerm, classSection);

		return receivedData.properties.subComponents		
		.map(subcomponent => subcomponent.properties)
		.reduce(function(response, currentClassSection) {
			const classSection = {
				'startDate': currentClassSection.dtstart.value.substring(
					currentClassSection.dtstart.value.lastIndexOf("T") + 1, 
					currentClassSection.dtstart.value.lastIndexOf(":")
				),
				'endDate': currentClassSection.dtend.value.substring(
					currentClassSection.dtend.value.lastIndexOf("T") + 1, 
					currentClassSection.dtend.value.lastIndexOf(":")
				),
				'location': currentClassSection.location.value.split("Room ")[1],
				'weekday': currentClassSection.rrule.value.substring(
					currentClassSection.rrule.value.lastIndexOf("=") + 1
				)
			};
			response.push(classSection);
			return response;
		}, []);		
	}

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadAuthenticationTypes : loadAuthenticationTypes,
		loadAuthenticationMethodFeatures : loadAuthenticationMethodFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore,
		saveUserChosenCoursesAndClasses : saveUserChosenCoursesAndClasses,
		loadUserSubscribedCourses : loadUserSubscribedCourses,
		loadUserSubscribedClassesInCourse : loadUserSubscribedClassesInCourse,
		deleteUserClass : deleteUserClass,
		deleteUserCourse : deleteUserCourse,
		editUser : editUser,
		loadClassSectionSchedule : loadClassSectionSchedule
	};
}
