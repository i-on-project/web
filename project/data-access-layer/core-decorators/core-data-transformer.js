'use strict'

module.exports = function(data) {

	const loadAllProgrammes = async function (metadata) {
		
		const receivedData = await data.loadAllProgrammes(metadata);
		
		const cache_control = receivedData.metadata.get('Cache-Control');
		
		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		};
		
		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		const transformedData = receivedData.data.entities
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
		
		return {
			"metadata": receivedmetadata,
			"data": transformedData
		};
	};
	/* Returned data Example:
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


	const loadAllProgrammeOffers = async function(programmeId, metadata) {
		const receivedData = await data.loadAllProgrammeOffers(programmeId, metadata);

		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}

		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 
		
		const transformedData = receivedData.data.entities
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

		return {
			"metadata": receivedmetadata,
			"data": transformedData
		};
	};
	/* Returned data Example:
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


	const loadProgrammeData = async function(programmeId, metadata) {
		const receivedData = await data.loadProgrammeData(programmeId, metadata);
	
		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}

		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		const transformedData = {
			"id": receivedData.data.properties.id,
			"name": receivedData.data.properties.name,
			"acronym": receivedData.data.properties.acronym,
			"termSize": receivedData.data.properties.termSize,
			"department": receivedData.data.properties.department,
			"coordination": receivedData.data.properties.coordination,
			"contacts": receivedData.data.properties.contacts,
			"sourceLink": receivedData.data.properties.sourceLink,
			"description": receivedData.data.properties.description,
		};

		return {
			"metadata": receivedmetadata,
			"data": transformedData
		};
	};
	/* Returned data Example:
	* {
	*	'id': '3',
	*	'name': 'Licenciatura em Engenharia Informática, Redes e Telecomunicações',
	*	'acronym': 'LEIRT',
	*	'termSize': 6,
	*	'department': 'ADEETC',
	*	'coordination': [
    *    	{'teacher': 'Professor ...'},
    *   	...,
    *    	{'teacher': 'Professor ...'}
    *	],
    *	'contacts': 'ccleirt@deetc.isel.ipl.pt',
    *	'sourceLink': 'https://www.isel.pt/cursos/licenciaturas/engenharia-informatica-redes-e-telecomunicacoes',
    *	'description': 'O curso de Licenciatura em Engenharia Informática, Redes e Telecomunicações (LEIRT)...'
	* }
	*/


	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm, metadata)  {
	
		const receivedData = await data.loadCourseClassesByCalendarTerm(courseId, calendarTerm, metadata) ;
	
		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}

		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		const courseData = receivedData.data.properties;
		const course = {
			'id' : courseData.id,
			'courseId' : courseData.courseId,
			'acronym' : courseData.courseAcr,
			'name' : courseData.name,
			'classes': []
		} 

		const transformedData = receivedData.data.entities
		.filter(entity => entity.properties.hasOwnProperty('id'))
		.map(entity => entity.properties)
		.reduce(function(newResponse, currentClass) {
			newResponse.classes.push(currentClass.id);
			return newResponse;
		  }, course);

		return {
			"metadata": receivedmetadata,
			"data": transformedData
		};
	}
	/* Returned data Example:
	* {
	*	'id' : 2, 
	*	'courseId' : 2,
	*	'acronym' : 'DAW',
	*	'name' : 'Desenvolvimento de Aplicações Web',
	*	'classes': ['1D','1N','2D']
	* } 
	*/

	const loadAboutData = async function (metadata) {

		const receivedData = await data.loadAboutData(metadata);

		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}
		
		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 
		
		return {
			"metadata": receivedmetadata,
			"data": receivedData
		};
	};
	/* Returned data Example:
	* {
	*	"department": "ADEETC",
	*	"departmentImage": "ADEETC.png",
	*	"projects": [
	*		{
	*			"name": "web",
	*			"students": [
	*				{"student": "Catarina Palma LEIRT 20/21"},
	*				{"student": "Ricardo Severino LEIRT 20/21"}
	*			],
	*			"image": "web.png"
	*		},
	*		...
	*		{
	*			"name": "integration",
	*			"students": [
	*				{"student": "Miguel Teixeira LEIC 19/20"},
	*				{"student": "Samuel Costa LEIC 19/20"},
	*				{"student": "Cristiano Morgado LEIC 20/21"},
	*				{"student": "Ricardo Canto LEIC 20/21"}
	*			],
	*			"image": "integration.png"
	*		}
	*	],
	*	"teachers": [
	*		{"teacher": "Professor João Trindade"},
	*		{"teacher": "Professor Luís Falcão"},
	*		{"teacher": "Professor Paulo Pereira"},
	*		{"teacher": "Professor Pedro Felix"}
	*	]
	* }
	*/


	const loadClassSectionSchedule = async function(courseId, calendarTerm, classSection, metadata) {
		const receivedData = await data.loadClassSectionSchedule(courseId, calendarTerm, classSection, metadata);

		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}
		
		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		const transformedData = receivedData.data.properties.subComponents		
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
		
		return {
			"metadata": receivedmetadata,
			"data": transformedData
		};

	}
	/* Returned data Example:
	* [
	*	{
	*		'startDate': '08:00',
	*		'endDate': '11:00',
	*		'location': 'G.2.1',
	*		'weekday': 'TU'
	* 	},
	*	{
	*		'startDate': '10:00',
	*		'endDate': '11:30',
	*		'location': 'E.2.1',
	*		'weekday': 'WE'
	* 	}
	* ]
	*/


	const loadCourseEventsInCalendarTerm = async function(courseId, calendarTerm, metadata) {
		const receivedData = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm, metadata);
	
		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}
		
		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		const transformedData = receivedData.data.properties.subComponents		
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
				event["startTime"] = currentEvent.properties.dtstart.value.substring(currentEvent.properties.dtstart.value.lastIndexOf("T") + 1,
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

		return {
			"metadata": receivedmetadata,
			"data": transformedData
		};
	}
	/* Returned data Example:  
	* {
	*	'assignments': [
	*		{'event': 'Trabalho de CN', 'date':'2021-06-11', 'time':'19:30'}, 
	*		{'event': 'Exame de DAW', 'date':'2021-06-28', 'time':'19:00'}, 
	*		{'event': 'Trabalho de PI', 'date':'2021-06-21', 'time':'18:30'}, , 
	*		{'event': 'Exame de AC', 'date':'2021-06-26', 'time':'18:30'}
	*	],
	*	'testsAndExams': [
	*		{'event': 'Teste de GAP', 'date':'2021-06-11' , 'startTime':'10:30', 'endTime':'12:30', 'location':'G.2.14'},
	*		{'event': 'Teste de PI', 'date':'2021-06-22' , 'startTime':'09:30', 'endTime':'12:30', 'location':'G.2.14'},
	*		{'event': 'Teste de DAW', 'date':'2021-06-28' , 'startTime':'18:30', 'endTime':'21:30', 'location':'G.2.10'}
	*	]
	* }
	*/

	const loadCurrentCalendarTerm = async function(metadata) {
		const receivedData = await data.loadCurrentCalendarTerm(metadata);

		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}
		
		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		return {
			"metadata": receivedmetadata,
			"data": receivedData.calendarTerm
		};
	}
	
	const loadCalendarTermGeneralInfo = async function(calendarTerm, metadata) {

		const receivedData = await data.loadCalendarTermGeneralInfo(calendarTerm, metadata);
		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}

		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		return {
			"metadata": receivedmetadata,
			"data": receivedData
		};
	}
	
	/******* Authentication *******/ 

	const loadAuthenticationMethodsAndFeatures = async function (metadata) {
		const receivedData = await data.loadAuthenticationMethodsAndFeatures(metadata);
		
		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}
		
		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 

		return {
			"metadata": receivedmetadata,
			"data": receivedData.data
		};
	};
	/* Returned data Example:
	* [
	*	{
	*		"allowed_domains": [
	*		"*.isel.pt",
	*		"*.isel.ipl.pt"
	*		],
	*		"type": "email",
	*		"create": true
	*	}
	* ]
	*/


	const submitInstitutionalEmail = async function(email) {
		const receivedData = await data.submitInstitutionalEmail(email);

		return {
			"auth_req_id": receivedData.auth_req_id,
			"expires_in": receivedData.expires_in
		}
	};
	/* Returned data Example:
	* [
	*	{
	*		'auth_req_id': '55fe0c2e-2c8c-45ab-b7d4-0299c10c32bc',
	*		'expires_in': 300
	*	}
	* ]
	*/


	const pollingCore = async function(authForPoll) {
		const receivedData = await data.pollingCore(authForPoll);
		
		const test = receivedData.hasOwnProperty("access_token") ? 
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
		return test;
	};
	/* Returned data Example:
	* {
	*	'access_token': 'SZ84SGZA7ACALtc37S29PgQ7pVnIpXH-zBYGMq6UVheiNXkD1jqZB5tkAiLJALIO3prDatd_VD2O4OewzuStgw',
	*	'token_type': 'Bearer',
	*	'refresh_token': 'u3zPqp7qpDoMjYhUzKlF-X3G1cxnkRT5Pus2GlXf6smwsq-B8Sa6x2-pwfIgpDcHO5ovxSIYxY433pBOs0JKHQ',
	*	'expires_in': 10799,
	*	'id_token': 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MjM3NjQzNjcsImF1ZCI6IjIyZGQxNTUxLWRiMjMtNDgxYi1hY2RlLWQyODY0NDAzODhhNSIsImlhdCI6MTYyMzc2MDc2NywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDoxMDAyMy9hcGkiLCJzdWIiOiI0MGViZmZjZC03MTYwLTQ3ZmMtYTg3YS0zNzBjODVhMmM3ODkiLCJlbWFpbCI6IkFqNkBhbHVub3MuaXNlbC5wdCJ9.i2mp43JFEdJll6ijPEY6ZGEC0ttYc6d8_U1c2cHjeo0'
	* }
	* OR
	* {
	*	'error':'authorization_pending',
	*	'error_description':'The auth request is still waiting for a response'
	* }
	*/


	/* User related methods */

	const saveUserClassesAndClassSections = function(user, id, classSection) {
		return data.saveUserClassesAndClassSections(user, id, classSection);
	}

	const loadUserSubscribedClassSectionsInClass = async function(user, id) {
		const receivedData = await data.loadUserSubscribedClassSectionsInClass(user, id);

		return receivedData.entities		
		.map(entities => entities.properties)
		.reduce(function(response, currentClass) {
			response.push(currentClass.sectionId);
			return response;
		}, []);
	}
	/* Returned data Example:
	* [
	*	'1D',
	*	'2D',
	*	'1N'
	* ]
	*/
	////

	const loadUserSubscribedClassesAndClassSections = async function(user) {
		const receivedData = await data.loadUserSubscribedClassesAndClassSections(user);

		return receivedData.entities		
		.map(entities => entities.properties)
		.reduce(function(response, currentClassAndClassSection) {
			
			let found = false;
			for(var i = 0; i < response.length; i++) {
				if (response[i].id === currentClassAndClassSection.classId) {
					response[i].classes.push(currentClassAndClassSection.id)
					found = true;
					break;
				}
			}
			if(!found) {
				const subscribedClass = {
					"id": currentClassAndClassSection.classId,
					"courseId": currentClassAndClassSection.courseId,
					"acronym": currentClassAndClassSection.courseAcr,
					"calendarTerm": currentClassAndClassSection.calendarTerm,
					"classes": [currentClassAndClassSection.id]
				};
				response.push(subscribedClass);
			}
			return response;
		}, []);
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

	const loadUser = async function(access_token, token_type, email, metadata) {
		const receivedData = await data.loadUser(access_token, token_type, email, metadata);

		const cache_control = receivedData.metadata.get('Cache-Control');

		const receivedmetadata = {
			"ETag": receivedData.metadata.get('ETag'),
			"maxAge": getMaxAge(cache_control)
		}
		
		if(!receivedData.hasOwnProperty('data')) return {"metadata": receivedmetadata};	/// The resource has not been modified 
		
		return {
			"metadata": receivedmetadata,
			"data": {
				'email': receivedData.data.properties.email,
				'username': receivedData.data.properties.name
			}
		};
	}
	/* Returned data Example:
	* {
	*	'email': 'A12345@alunos.isel.pt',
	*	'username': 'João'
	* }
	*/

	const deleteUser = function(user) {
		return data.deleteUser(user);
	}
	
	const refreshAccessToken = function(user) {
		return data.refreshAccessToken(user);
	}
	/* Returned data Example:
	* {
	*	'access_token': 'The new access token',
	*	'token_type': 'Bearer',
	*	'refresh_token': 'The new refresh token, used to refresh the new access token',
	*	'expires_in': 10799,
	*	'id_token': 'The id token, containing a series of assertions about the user'
	* }
	*/

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
const getMaxAge = function(cache_control) {
	if(cache_control) {
		const max_age_string = cache_control.substring((cache_control.indexOf("max-age=")));
		const max_age = max_age_string.substring( max_age_string.indexOf('=') + 1, max_age_string.indexOf(','));
		return max_age;
	}
};