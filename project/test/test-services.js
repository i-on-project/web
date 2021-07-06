'use strict'

const expect = require('chai').expect
const serviceCreator = require('../business-logic-layer/i-on-web-services.js');
const internalErrors = require('../common/i-on-web-errors.js');
const testsUsers = require('./testsUsers');

describe('Services', function () {

	describe('getHome', function() { 
		
		it('should return the home page info (user not logged in)', async function () {	
			
			const testProgrammes = [
				{
					"programmeId": 3,
					"acronym": "LEIRT",
					"name": "Engenharia Informática, Redes e Telecomunicações",
					"degree": "bachelor"
				},
				{
					"programmeId": 1,
					"acronym": "LEIC",
					"name": "Engenharia Informática e de Computadores",
					"degree": "bachelor"
				},
				{
					"programmeId": 4,
					"acronym": "LEETC",
					"name": "Engenharia Electrónica e Telecomunicações e de Computadores",
					"degree": "bachelor"
				},
				{
					"programmeId": 2,
					"acronym": "MEIC",
					"name": "Engenharia Informática e de Computadores",
					"degree": "master"
				},
				{
					"programmeId": 13,
					"acronym": "MEET",
					"name": "Engenharia de Eletrónica e Telecomunicações",
					"degree": "master"
				}
			];

			const expected = {
				"bachelor": [
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					},
					{
						"programmeId": 1,
						"acronym": "LEIC",
						"name": "Engenharia Informática e de Computadores",
						"degree": "bachelor"
					},
					{
						"programmeId": 4,
						"acronym": "LEETC",
						"name": "Engenharia Electrónica e Telecomunicações e de Computadores",
						"degree": "bachelor"
					}
				], 
				"master": [
					{
						"programmeId": 2,
						"acronym": "MEIC",
						"name": "Engenharia Informática e de Computadores",
						"degree": "master"
					},
					{
						"programmeId": 13,
						"acronym": "MEET",
						"name": "Engenharia de Eletrónica e Telecomunicações",
						"degree": "master"
					}
				]
			};
			
			const data = {
				loadAllProgrammes: async function() {
					return testProgrammes;
				}
			};

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = null;

			// Act
			const response = await service.getHome(user);

			// Assert
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);

		}),

		it('should return the home page info along with the user events', async function () {	

			const expected = {
				"bachelor": [
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					},
					{
						"programmeId": 1,
						"acronym": "LEIC",
						"name": "Engenharia Informática e de Computadores",
						"degree": "bachelor"
					},
					{
						"programmeId": 4,
						"acronym": "LEETC",
						"name": "Engenharia Electrónica e Telecomunicações e de Computadores",
						"degree": "bachelor"
					}
				], 
				"master": [
					{
						"programmeId": 2,
						"acronym": "MEIC",
						"name": "Engenharia Informática e de Computadores",
						"degree": "master"
					},
					{
						"programmeId": 13,
						"acronym": "MEET",
						"name": "Engenharia de Eletrónica e Telecomunicações",
						"degree": "master"
					}
				],
				"events": {
					"calendar": [],
					"assignments": [
					  {
						"event": "[PI]: Assignment #1",
						"date": "2020-11-08",
						"time": "23:59"
					  },
					  {
						"event": "[PI]: Assignment #2",
						"date": "2020-12-28",
						"time": "23:59"
					  }
					],
					"testsAndExams": [
					  {
						"event": "1st Exam PI",
						"date": "2021-01-21",
						"startTime": "18:00",
						"endTime": "19:30",
						"location": "A.2.5"
					  },
					  {
						"event": "2nd Exam PI",
						"date": "2021-02-03",
						"startTime": "10:00",
						"endTime": "12:30",
						"location": "F.1.2"
					  }
					]
				}
			};
			
			const data = {
				loadAllProgrammes: async function() {
					return [
						{
							"programmeId": 3,
							"acronym": "LEIRT",
							"name": "Engenharia Informática, Redes e Telecomunicações",
							"degree": "bachelor"
						},
						{
							"programmeId": 1,
							"acronym": "LEIC",
							"name": "Engenharia Informática e de Computadores",
							"degree": "bachelor"
						},
						{
							"programmeId": 4,
							"acronym": "LEETC",
							"name": "Engenharia Electrónica e Telecomunicações e de Computadores",
							"degree": "bachelor"
						},
						{
							"programmeId": 2,
							"acronym": "MEIC",
							"name": "Engenharia Informática e de Computadores",
							"degree": "master"
						},
						{
							"programmeId": 13,
							"acronym": "MEET",
							"name": "Engenharia de Eletrónica e Telecomunicações",
							"degree": "master"
						}
					];
				},

				loadCurrentCalendarTerm: async function() {
					return {
						"calendarTerm": "2021i"
					};
				},

				loadCalendarTermGeneralInfo: async function(calendarTerm) {
					return [];
				},

				loadUserSubscribedCourses: async function(user) {
					return [
						{
							"id": 1,
							"courseId": 1,
							"acronym": "PI",
							"calendarTerm": "2021i"
						}
					];
				},

				loadCourseEventsInCalendarTerm: async function(courseId, calendarTerm) {
					return {
						"assignments": [
						  {
							"event": "[PI]: Assignment #1",
							"date": "2020-11-08",
							"time": "23:59"
						  },
						  {
							"event": "[PI]: Assignment #2",
							"date": "2020-12-28",
							"time": "23:59"
						  }
						],
						"testsAndExams": [
						  {
							"event": "1st Exam PI",
							"date": "2021-01-21",
							"startTime": "18:00",
							"endTime": "19:30",
							"location": "A.2.5"
						  },
						  {
							"event": "2nd Exam PI",
							"date": "2021-02-03",
							"startTime": "10:00",
							"endTime": "12:30",
							"location": "F.1.2"
						  }
						]
					};
				}
			};

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[0];

			// Act
			const response = await service.getHome(user);
		
			// Assert
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.events).to.deep.eql(expected.events);
		})	
	}),

	describe('getProgrammeCalendarTermOffers', function() { 
		
		it('should return 1 offer', async function () {			
			// Arrange

			const testOffers = [
				{
					"acronym":"DAW",
					"name":"Desenvolvimento de Aplicações Web",
					"courseId":2,
					"id":1,
					"termNumber":[6,4],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				},
				{
					"acronym":"LS",
					"name":"Laboratório de Software",
					"courseId":1,
					"id":2,
					"termNumber":[6],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				},
				{
					"acronym":"CN",
					"name":"Computação na Nuvem",
					"courseId":5,
					"id":5,
					"termNumber":[6],
					"optional":true,
					"ects":6,
					"scientificArea":"IC"
				}
			];

			const expected =  [
				{
					"acronym":"DAW",
					"name":"Desenvolvimento de Aplicações Web",
					"courseId":2,
					"id":1,
					"termNumber":[6,4],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				},
				{
					"acronym":"LS",
					"name":"Laboratório de Software",
					"courseId":1,
					"id":2,
					"termNumber":[6],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				}
			];

			const data = {
				loadAllProgrammeOffers: async function() {
					return testOffers;
				},

				loadCourseClassesByCalendarTerm: async function(courseId) {
					if(courseId === 1) return {"courseId":courseId,"name":"Laboratório de Software","classes":["1D","1N","2D"]};
					else if(courseId === 2) return {"courseId":courseId,"name":"Desenvolvimento de Aplicações Web","classes":["1D","1N","2D"]};
					else { return {"courseId":courseId,"name":"Computação na Nuvem","classes":[]} }
				},

				loadAllProgrammes: async function() {
					return [];
				},

				loadCurrentCalendarTerm: async function() {
					return '2021v';
				}
			}
			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = null;
			const programmeId = 1;
			// Act
			const response = await service.getProgrammeCalendarTermOffers(programmeId, user);

			// Assert
			expect(response.programmeCalendarTermOffers).to.deep.eql(expected);
		}),

		it('should return 0 offers', async function () {			
			// Arrange

			const testOffers = [
				{
					"acronym":"DAW",
					"name":"Desenvolvimento de Aplicações Web",
					"courseId":2,
					"id":1,
					"termNumber":[6,4],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				},
				{
					"acronym":"LS",
					"name":"Laboratório de Software",
					"courseId":1,
					"id":2,
					"termNumber":[6],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				},
				{
					"acronym":"CN",
					"name":"Computação na Nuvem",
					"courseId":5,
					"id":5,
					"termNumber":[6],
					"optional":true,
					"ects":6,
					"scientificArea":"IC"
				}
			];

			const expected =  [];

			const data = {
				loadAllProgrammeOffers: async function() {
					return testOffers;
				},

				loadCourseClassesByCalendarTerm: async function(courseId) {
					return {"courseId": courseId,"name":"Computação na Nuvem","classes":[] };
				},

				loadAllProgrammes: async function() {
					return [];
				},

				loadCurrentCalendarTerm: async function() {
					return '2021v';
				}
			}
			const database = null;

			const service = serviceCreator(data, database);
			
			const user = null;
			const programmeId = 1;
			// Act
			const response = await service.getProgrammeCalendarTermOffers(programmeId, user);

			// Assert
			expect(response.programmeCalendarTermOffers).to.deep.eql(expected);
		})
		
	}),

	describe('getProgrammeData', function() { 
		
		it('should return programme data', async function () {			
			// Arrange

			const testOffers = [
				{
					"acronym":"DAW",
					"name":"Desenvolvimento de Aplicações Web",
					"courseId":2,
					"id":1,
					"termNumber":[6,4],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				},
				{
					"acronym":"LS",
					"name":"Laboratório de Software",
					"courseId":1,
					"id":2,
					"termNumber":[6],
					"optional":false,
					"ects":6,
					"scientificArea":"IC"
				},
				{
					"acronym":"CN",
					"name":"Computação na Nuvem",
					"courseId":5,
					"id":5,
					"termNumber":[6],
					"optional":true,
					"ects":6,
					"scientificArea":"IC"
				}
			];

			const testData = {
				"id":1,
				"name":"Licenciatura em Engenharia Informática e de Computadores",
				"acronym":"LEIC",
				"termSize":6,
				"department":"ADEETC","coordination":[
					{"teacher":"Professor Artur Jorge Ferreira"},
					{"teacher":"Professora Cátia Raquel Jesus Vaz"},
					{"teacher":"Professor  Manuel de Campos Lages Garcia Simão"},
					{"teacher":"Professor Nuno Miguel Soares Datia"},
					{"teacher":"Professor Pedro Miguel Florindo Miguéns Matutino"}
				],"contacts":"",
				"sourceLink":"https://www.isel.pt/cursos/licenciaturas/engenharia-informatica-e-de-computadores",
				"description":"O ciclo de estudos conducente ao grau de licenciado em Engenharia Informática...."}

			const expectedOffersByAcademicTerms =  {
				"4":[{"acronym":"DAW","name":"Desenvolvimento de Aplicações Web","courseId":2,"id":1,"termNumber":[6,4],"optional":false,"ects":6,"scientificArea":"IC"}],
				"6":[{"acronym":"DAW","name":"Desenvolvimento de Aplicações Web","courseId":2,"id":1,"termNumber":[6,4],"optional":false,"ects":6,"scientificArea":"IC"},{"acronym":"LS","name":"Laboratório de Software","courseId":1,"id":2,"termNumber":[6],"optional":false,"ects":6,"scientificArea":"IC"},{"acronym":"CN","name":"Computação na Nuvem","courseId":5,"id":5,"termNumber":[6],"optional":true,"ects":6,"scientificArea":"IC"}]};
			
			const expectedProgrammeData = testData;
			
			const data = {
				loadAllProgrammeOffers: async function() {
					return testOffers;
				},

				loadProgrammeData: async function() {
					return testData;
				},

				loadAllProgrammes: async function() {
					return [];
				}
				
			}
			const database = null;

			const service = serviceCreator(data, database);
			
			const user = null;
			const programmeId = 1;
			// Act
			const response = await service.getProgrammeData(programmeId, user);

			// Assert
			expect(response.offersByAcademicTerms).to.deep.eql(expectedOffersByAcademicTerms);
			expect(response.programme).to.deep.eql(expectedProgrammeData);
		})

	}),

	describe('getUserSchedule', function() { 

	}),

	describe('getUserEvents', function() { 

	}),

	describe('getUserCourses', function() { 

	}),

	describe('editUserCourses', function() { 

	}),

	describe('getClassesFromSelectedCourses', function() { 
		
		it('should return classes from one selected course', async function () {			
			// Arrange
			const expectedclassesByCourses = [{"courseId":1,"name":"Laboratório de Software","classes":["1D","1N","2D"]}];
			
			const data = {
				loadCourseClassesByCalendarTerm: async function() {
					return {"courseId":1,"name":"Laboratório de Software","classes":["1D","1N","2D"]};
				},

				loadAllProgrammes: async function() {
					return [];
				}
				
			}
			const database = null;

			const service = serviceCreator(data, database);
			
			const user = {'username': 'testUser'};
			const coursesIDs = 1;
			// Act
			const response = await service.getClassesFromSelectedCourses(user, coursesIDs);

			// Assert
			expect(response.classesByCourses).to.deep.eql(expectedclassesByCourses);
		})

	}),

	describe('saveUserChosenCoursesAndClasses', function() { 

	}),

	describe('getAboutData', function() { 

	}),

	describe('getProfilePage', function() { 

	}),

	describe('editProfile', function() { 

	}),

	describe('deleteUser', function() { 

	})
})
