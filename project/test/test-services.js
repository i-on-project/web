'use strict'

const expect = require('chai').expect
const serviceCreator = require('../business-logic-layer/i-on-web-services.js');
const internalErrors = require('../common/i-on-web-errors.js');
const testsUsers = require('./testsUsers');

describe('Services', function () {

	describe('getHome', function() { 
		
		it('should return the home page info (unauthenticated user)', async function () {	
			
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

		})

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
					"assignments": [],
					"testsAndExams": []
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

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021i"
					};
				},

				loadCalendarTermGeneralInfo: async function(calendarTerm) {
					return [];
				},

				loadUserSubscribedClassesAndClassSections: async function(user) {
					return [
						{
							"id": 1,
							"courseId": 1,
							"acronym": "PI",
							"calendarTerm": "2021i",
							"classes": ["1D"]
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

	describe('getProgrammeOffers', function() { 
		
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

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021i"
					};
				}
			}
			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[0];
			const programmeId = 1;
			// Act
			const response = await service.getProgrammeOffers(programmeId, user);

			// Assert
			expect(response.programmeOffers).to.deep.eql(expected);
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

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021v"
					};
				}
			}
			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[0];;
			const programmeId = 1;
			// Act
			const response = await service.getProgrammeOffers(programmeId, user);

			// Assert
			expect(response.programmeOffers).to.deep.eql(expected);
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

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
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
		
		it('should only return pages common info (unauthenticated user)', async function () {
		
			const expected =  {
				"bachelor": [						
					{
						"programmeId": 1,
						"acronym": "LEIC",
						"name": "Engenharia Informática e de Computadores",
						"degree": "bachelor"
					}
				],
				"master": [],
				"schedule": [],
				"user": undefined
			};

			const data = {
				
				loadAllProgrammes: async function() {
					return [				
						{
							"programmeId": 1,
							"acronym": "LEIC",
							"name": "Engenharia Informática e de Computadores",
							"degree": "bachelor"
						}
					];
				}
				
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;

			// Act
			const response = await service.getUserSchedule(user);

			// Assert
			expect(response.schedule).to.deep.eql(expected.schedule);
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);

		}),

		it('should return pages common info along with the user schedule (authenticated user subscribed to a class and class section)', async function () {
		
			const expected =  {
				"bachelor": [						
					{
						"programmeId": 1,
						"acronym": "LEIC",
						"name": "Engenharia Informática e de Computadores",
						"degree": "bachelor"
					}
				],
				"master": [],
				"schedule": [					
					{
						"acronym": "PI",
            			"classSection": "1D",
						"startDate": "11:00",
						"endDate": "13:00",
						"location": "E.1.7",
						"weekday": "WE",
					}
				],
				"user": testsUsers[1]
			};

			const data = {
				
				loadAllProgrammes: async function() {
					return [				
						{
							"programmeId": 1,
							"acronym": "LEIC",
							"name": "Engenharia Informática e de Computadores",
							"degree": "bachelor"
						}
					];
				},

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021i"
					};
				},

				loadUserSubscribedClassesAndClassSections: async function(user) {
					return [
						{
							"id": 1,
							"courseId": 1,
							"acronym": "PI",
							"calendarTerm": "2021i",
							"classes": ["1D"]
						}
					];
				},

				loadClassSectionSchedule: async function(courseId, calendarTerm, classSection) {
					return [
						{
							"startDate": "11:00",
							"endDate": "13:00",
							"location": "E.1.7",
							"weekday": "WE",
						}
					];
				}
				
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[1];

			// Act
			const response = await service.getUserSchedule(user);

			// Assert
			expect(response.schedule).to.deep.eql(expected.schedule);
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);
			
		}),
		
		it('should only return pages common info (authenticated user but hasnt subscribed any class and class section)', async function () {
		
			const expected =  {
				"bachelor": [						
					{
						"programmeId": 1,
						"acronym": "LEIC",
						"name": "Engenharia Informática e de Computadores",
						"degree": "bachelor"
					}
				],
				"master": [],
				"schedule": [],
				"user": testsUsers[0]
			};

			const data = {
				
				loadAllProgrammes: async function() {
					return [				
						{
							"programmeId": 1,
							"acronym": "LEIC",
							"name": "Engenharia Informática e de Computadores",
							"degree": "bachelor"
						}
					];
				},

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021i"
					};
				},

				loadUserSubscribedClassesAndClassSections: async function(user) {
					return [
						{
							"id": 1,
							"courseId": 1,
							"acronym": "PI",
							"calendarTerm": "2021i",
							"classes": ["1D"]
						}
					];
				},

				loadClassSectionSchedule: async function(courseId, calendarTerm, classSection) {
					return [];
				}
				
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[0];

			// Act
			const response = await service.getUserSchedule(user);

			// Assert
			expect(response.schedule).to.deep.eql(expected.schedule);
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);
			
		})
	}),

	describe('getUserCalendar', function() { 
		
		it('should only return pages common info (unauthenticated user)', async function () {
		
			const expected =  {
				"bachelor": [						
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					}
				],
				"master": [],
				"events": {
					"calendar": [
						{
							"date":"2021-06-28",
							"title": "Início do período de exames",
							"description": "(época normal)"
						},
						{
							"date":"2021-07-17",
							"title": "Fim do período de exames",
							"description": "(época normal)"
						}
					],
					"assignments": [],
					"testsAndExams": []
				},
				"user": undefined
			};

			const data = {
				
				loadAllProgrammes: async function() {
					return [				
						{
							"programmeId": 3,
							"acronym": "LEIRT",
							"name": "Engenharia Informática, Redes e Telecomunicações",
							"degree": "bachelor"
						}
					];
				},

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021v"
					};
				},

				loadCalendarTermGeneralInfo: async function() {
					return [
						{
							"date":"2021-06-28",
							"title": "Início do período de exames",
							"description": "(época normal)"
						},
						{
							"date":"2021-07-17",
							"title": "Fim do período de exames",
							"description": "(época normal)"
						}
					];
				}
				
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;

			// Act
			const response = await service.getUserCalendar(user);

			// Assert
			expect(response.events).to.deep.eql(expected.events);
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);

		}),

		it('should return pages common info along with the user events (authenticated user)', async function () {
		
			const expected =  {
				"bachelor": [						
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					}
				],
				"master": [],
				"events": {
					"calendar": [
						{
							"date":"2021-06-28",
							"title": "Início do período de exames",
							"description": "(época normal)"
						},
						{
							"date":"2021-07-17",
							"title": "Fim do período de exames",
							"description": "(época normal)"
						}
					],
					"assignments": [
						{
						  "event": "[SL]: Assignment #1",
						  "date": "2021-04-08",
						  "time": "23:59"
						},
						{
						  "event": "[SL]: Assignment #2",
						  "date": "2021-06-20",
						  "time": "23:59"
						}
					  ],
					  "testsAndExams": [
						{
						  "event": "1st Exam SL",
						  "date": "2020-06-10",
						  "startTime": "18:00",
						  "endTime": "19:30",
						  "location": "A.2.5"
						},
						{
						  "event": "2nd Exam SL",
						  "date": "2020-07-24",
						  "startTime": "10:00",
						  "endTime": "12:30",
						  "location": "F.1.2"
						}
					  ]
				},
				"user": testsUsers[0]
			};

			const data = {
				
				loadAllProgrammes: async function() {
					return [				
						{
							"programmeId": 3,
							"acronym": "LEIRT",
							"name": "Engenharia Informática, Redes e Telecomunicações",
							"degree": "bachelor"
						}
					];
				},

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021v"
					};
				},

				loadCalendarTermGeneralInfo: async function() {
					return [
						{
							"date":"2021-06-28",
							"title": "Início do período de exames",
							"description": "(época normal)"
						},
						{
							"date":"2021-07-17",
							"title": "Fim do período de exames",
							"description": "(época normal)"
						}
					];
				},
				
				loadUserSubscribedClassesAndClassSections: async function(user) {
					return [
						{
							"id": 1,
							"courseId": 1,
							"acronym": "PI",
							"calendarTerm": "2021v",
							"classes": ["1N"]
						}
					];
				},

				loadCourseEventsInCalendarTerm: async function(courseId, calendarTerm) {
					return {
						"assignments": [
						  {
							"event": "[SL]: Assignment #1",
							"date": "2021-04-08",
							"time": "23:59"
						  },
						  {
							"event": "[SL]: Assignment #2",
							"date": "2021-06-20",
							"time": "23:59"
						  }
						],
						"testsAndExams": [
						  {
							"event": "1st Exam SL",
							"date": "2020-06-10",
							"startTime": "18:00",
							"endTime": "19:30",
							"location": "A.2.5"
						  },
						  {
							"event": "2nd Exam SL",
							"date": "2020-07-24",
							"startTime": "10:00",
							"endTime": "12:30",
							"location": "F.1.2"
						  }
						]
					};
				}
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[0];

			// Act
			const response = await service.getUserCalendar(user);

			// Assert
			expect(response.events).to.deep.eql(expected.events);
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);
			
		})

	}),

	describe('getUserSubscribedClassesAndClassSections', function() { 
		
		it('should only return pages common info (unauthenticated user)', async function () {
		
			const expected =  {
				"bachelor": [						
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					}
				],
				"master": [],
				"userClasses": [],
				"user": undefined
			};

			const data = {
				
				loadAllProgrammes: async function() {
					return [				
						{
							"programmeId": 3,
							"acronym": "LEIRT",
							"name": "Engenharia Informática, Redes e Telecomunicações",
							"degree": "bachelor"
						}
					];
				}
				
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;

			// Act
			const response = await service.getUserSubscribedClassesAndClassSections(user);

			// Assert
			expect(response.userClasses).to.deep.eql(expected.userClasses);
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);

		}),

		it('should return pages common info along with the user subscribed classes and class sections (authenticated user)', async function () {
		
			const expected =  {
				"bachelor": [						
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					}
				],
				"master": [],
				"userClasses": [
					{
					    "acronym": "DAW",
					    "calendarTerm": "2021v",
					    "classes": ["2D"],
					    "courseId": 2,
					    "id": 2,
					    "name": "Desenvolvimento de Aplicações Web"
					}
				],
				"user": testsUsers[1]
			};

			const data = {
				
				loadAllProgrammes: async function() {
					return [				
						{
							"programmeId": 3,
							"acronym": "LEIRT",
							"name": "Engenharia Informática, Redes e Telecomunicações",
							"degree": "bachelor"
						}
					];
				},

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021v"
					};
				},

				loadUserSubscribedClassesAndClassSections: async function(user) {
					return [
						{
							"id": 2,
							"courseId": 2,
							"acronym": "DAW",
							"calendarTerm": "2021v",
							"classes": ["2D"]
						}
					];
				},

				loadCourseClassesByCalendarTerm: async function(courseId, calendarTerm) {
					return {
						"id" : 2, 
						"courseId" : 2,
						"acronym" : "DAW",
						"name" : "Desenvolvimento de Aplicações Web",
						"classes": ["1D","1N","2D"]
					};
				}
				
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[1];

			// Act
			const response = await service.getUserSubscribedClassesAndClassSections(user);

			// Assert
			expect(response.userClasses).to.deep.eql(expected.userClasses);
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);
		})

	}),

	describe('editUserSubscribedClassesAndClassSections', function() { 
		
		it('should return unauthenticated error (unauthenticated user)', async function () {
		
			const data = null;

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;
			const selectedClassesAndClassSections = null;

			// Act
			try {
				await service.editUserSubscribedClassesAndClassSections(user, selectedClassesAndClassSections);
			} catch (err) {
				// Assert
				expect(err).to.deep.eql(5);
			}
		})

	}),

	describe('getClassSectionsFromSelectedClasses', function() { 
		
		it('should return classes from selected class', async function () {			
			// Arrange
			const expectedclassSectionsByClasses = [{"id": 1, "courseId": 1,"name": "Laboratório de Software","classes": ["1D","1N","2D"]}];
			
			const data = {
				loadCourseClassesByCalendarTerm: async function() {
					return {"id": 1, "courseId": 1, "name": "Laboratório de Software", "classes": ["1D","1N","2D"]};
				},

				loadAllProgrammes: async function() {
					return [];
				},

				loadCalendarTerm: async function() {
					return {
						"currentCalendarTerm": "2021i"
					};
				},

				loadUserSubscribedClassesAndClassSections: async function() {
					return [];
				}
			}

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = {'username': 'testUser'};
			const coursesIDs = 1;
			// Act
			const response = await service.getClassSectionsFromSelectedClasses(user, coursesIDs);

			// Assert
			expect(response.classeSectionsByClass).to.deep.eql(expectedclassSectionsByClasses);
		})

	}),

	describe('saveUserClassesAndClassSections', function() { 
		
		it('should return unauthenticated error (unauthenticated user)', async function () {
		
			const data = null;

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;
			const selectedClassesAndClassSections = null;

			// Act
			try {
				await service.saveUserClassesAndClassSections(user, selectedClassesAndClassSections);
			} catch (err) {
				// Assert
				expect(err).to.deep.eql(5);
			}
		})

	}),

	describe('getAboutData', function() { 
		
		it('should return common page info and about info', async function () {

			const expected = {
				"bachelor": [
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					}
				], 
				"master": [],
				"user": undefined,
				"aboutData" : {
					"department": "ADEETC",
					"projects": [
						{
							"name": "web",
							"students": [
								{"student": "Catarina Palma LEIRT 20/21"},
								{"student": "Ricardo Severino LEIRT 20/21"}
							],
						}
					],
					"teachers": [
						{"teacher": "Professor João Trindade"},
						{"teacher": "Professor Luís Falcão"}
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
						}
					];
				},

				loadAboutData: async function() {
					return {
						"department": "ADEETC",
						"projects": [
							{
								"name": "web",
								"students": [
									{"student": "Catarina Palma LEIRT 20/21"},
									{"student": "Ricardo Severino LEIRT 20/21"}
								],
							}
						],
						"teachers": [
							{"teacher": "Professor João Trindade"},
							{"teacher": "Professor Luís Falcão"}
						]
					}
				}
			};

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;

			// Act
			const response = await service.getAboutData(user);

			// Assert
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);
			expect(response.aboutData).to.deep.eql(expected.aboutData);
		})

	}),

	describe('getProfilePage', function() { 

		it('should return the user profile page (authenticated user)', async function () {

			const expected = {
				"bachelor": [], 
				"master": [],
				"user": {
					"sessionId":"sessionId_1",
					"email": "A45241@alunos.isel.pt",
					"username": "Catarina Palma",
					"access_token":"access_token_1",
					"token_type":"Bearer",
					"refresh_token":"refresh_token_1",
					"expires_in":3599,
					"id_token":"id_token_1"
				}
			};
			
			const data = {
				loadAllProgrammes: async function() {
					return [];
				}
			};

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[0];

			// Act
			const response = await service.getProfilePage(user);

			// Assert
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user).to.deep.eql(expected.user);

		}),

		it('should return unauthenticated error (unauthenticated user)', async function () {
		
			const data = null;

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;

			// Act
			try {
				await service.getProfilePage(user);
			} catch (err) {
				// Assert
				expect(err).to.deep.eql(5);
			}
		})

	}),

	describe('editProfile', function() { 

		it('should return the common page info and updated user info (authenticated user)', async function () {
			
			const testProgrammes = [
				{
					"programmeId": 3,
					"acronym": "LEIRT",
					"name": "Engenharia Informática, Redes e Telecomunicações",
					"degree": "bachelor"
				}
			];

			const expected = {
				"bachelor": [
					{
						"programmeId": 3,
						"acronym": "LEIRT",
						"name": "Engenharia Informática, Redes e Telecomunicações",
						"degree": "bachelor"
					}
				], 
				"master": [],
				"user": {
					"sessionId":"sessionId_2",
					"email": "A45245@alunos.isel.pt",
					"username": "Ricardo Filipe Severino",
					"access_token":"access_token_2",
					"token_type":"Bearer",
					"refresh_token":"refresh_token_2",
					"expires_in":3599,
					"id_token":"id_token_2"
				}
			};
			
			const data = {
				loadAllProgrammes: async function() {
					return testProgrammes;
				},

				editUser: async function(user, newUsername) {
					user.username = newUsername;
				}
			};

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = testsUsers[1];
			const newUserInfo = {
				"newUsername": "Ricardo Filipe Severino"
			}

			// Act
			const response = await service.editProfile(user, newUserInfo);

			// Assert
			expect(response.bachelor).to.deep.eql(expected.bachelor);
			expect(response.master).to.deep.eql(expected.master);
			expect(response.user.username).to.deep.eql(expected.user.username);

		}),

		it('should return unauthenticated error (unauthenticated user)', async function () {
		
			const data = null;

			const sessionDB = null;

			const service = serviceCreator(data, sessionDB);
			
			const user = undefined;
			const newUserInfo = {"newUsername": "Ricardo Filipe Severino"}

			// Act
			try {
				await service.editProfile(user, newUserInfo);
			} catch (err) {
				// Assert
				expect(err).to.deep.eql(5);
			}
		})
	})
	
})
