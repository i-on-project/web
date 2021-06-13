'use strict'

const expect = require('chai').expect
const serviceCreator = require('../business-logic-layer/i-on-web-services.js');
const internalErrors = require('../common/i-on-web-errors.js');

describe('Services', function () {

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
	})
})
