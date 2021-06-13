'use strict'

module.exports = function(data) {

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
	/* Return Example:
	* [{
	*	'programmeId': 3
	*	'acronym': "LEIRT"
	*	'name': "Licenciatura em Engenharia Informática, Redes e Telecomunicações"
	*	'degree': "bachelor"
	* }, 
	* ...
	* {
	*	'programmeId': 2
	*	'acronym': "MEIC"
	*	'name': "Licenciatura em Informática e de Computadores"
	*	'degree': "bachelor"
	* }]
	*/


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
	/* Return Example:
	* [{
	*	'acronym': 'PI',
	*	'name': 'Programação na Internet',
	*	'courseId': 5,
	*	'id': 3,
	*	'termNumber': [5],
	*	'optional': false,
	*	'ects': 6,
	*	'scientificArea': 'IC'
	* }, 
	* ...
	* {
	*	'acronym': 'CN',
	*	'name': 'Computação na Nuvem',
	*	'courseId': 9,
	*	'id': 7,
	*	'termNumber': [6],
	*	'optional': false,
	*	'ects': 6,
	*	'scientificArea': 'IC'
	* }]
	*/


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
	/* Return Example:
	* {
	*	'id': '3',
	*	'name': 'Licenciatura em Engenharia Informática, Redes e Telecomunicações',
	*	'acronym': 'LEIRT',
	*	'termSize': 6,
	*	'department': 'ADEETC',
	*	'coordination': ,
	*	'contacts': ,
	*	'sourceLink': ,
	*	'description': 
	* }
	*/


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

	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm) {
		const receivedData = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm);
	
		return receivedData.properties.subComponents		
		.reduce(function(response, currentEvent) {
			let event = {
				"event": currentEvent.properties.summary.value
			}

			if(currentEvent.type === "todo") { // The event is e.g. an assignment
				event["date"] = currentEvent.properties.due.value.substring( 0,
						currentEvent.properties.due.value.lastIndexOf("T")
					);
				event["time"] = currentEvent.properties.due.value.substring(currentEvent.properties.due.value.lastIndexOf("T") + 1,
						currentEvent.properties.due.value.lastIndexOf(":")
					);

				response.assignments.push(event);

			} else if (currentEvent.type === "event") { // The event is e.g. an exam or test
				event["date"] = currentEvent.properties.dtstart.value.substring( 0,
						currentEvent.properties.dtstart.value.lastIndexOf("T")
					);
				event["starTime"] = currentEvent.properties.dtstart.value.substring(currentEvent.properties.dtstart.value.lastIndexOf("T") + 1,
					currentEvent.properties.dtstart.value.lastIndexOf(":")
				);
				event["endTime"] = currentEvent.properties.dtend.value.substring(currentEvent.properties.dtend.value.lastIndexOf("T") + 1,
					currentEvent.properties.dtend.value.lastIndexOf(":")
				);
				event["location"] = currentEvent.properties.location.value.split("Room ")[1];

				response.testsAndExams.push(event);
			}

			return response;
		}, {
			"assignments": [],
			"testsAndExams": []
		});		
	}

	/******* Authentication *******/ 

	const loadAuthenticationMethodsAndFeatures = async function () {
		return data.loadAuthenticationMethodsAndFeatures();
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

	/* User related methods */

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

	const loadUser = async function(tokens) {
		const receivedData = await data.loadUser(tokens);
		return {
			'email': receivedData.properties.email,
			'username': receivedData.properties.name
		};
	}
	/* Return Example:
	* {
	*	'email': 'A12345@alunos.isel.pt',
	*	'username': 'João'
	* }
	*/

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
