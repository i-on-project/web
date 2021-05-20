'use strict'

const error = require('./i-on-web-errors.js');

module.exports = function(data) {

	const getHome = async function(user) {
		return {user: user, page: 'home'};
	};

	const getUserSchedule = async function(user) {
		return {user: user, page: "schedule"};
	};

	const getUserCalendar = async function(user) {
		return {user: user, page: "calendar"};
	};

	const getUserCourses = async function(user) {

		// Obtain course info to display
		const coursesIDs = Object.keys(user.selectedCoursesAndClasses);
		const selectedCourses = []; 

		for(let i = 0; i < coursesIDs.length; i++) {
			const course = await data.loadCourseByID(coursesIDs[i]);
			const newObj = {
				"name": course.entities[0].properties.name,
				"acronym": course.entities[0].properties.acronym,
				"classes": user.selectedCoursesAndClasses[coursesIDs[i]],
				"id": coursesIDs[i]
			};
			selectedCourses.push(newObj);
		}

		return {
			username: user.username, 
			selectedCourses: selectedCourses, 
			page: "myCourses"
		};
	};

	const getClasses = async function(body) {
		// TO DO - Change/Simplify
		const coursesIDs = Object.values(body) // {"3":"4","4":["3","1"],"5":["2","5","6"]}
			.reduce((res, curr) => res.concat(curr), []) // ["4",["3","1"],["2","5","6"]]
			.map(courseId => parseInt(courseId)) // [4, 3, 1, 2, 5, 6]
			.filter(courseId => courseId != 0); // TO DO - Change

		// TO DO - Simplify the following code
		const courses = [];
		for(let i = 0; i < coursesIDs.length; i++)
			courses.push(await data.loadCourseByID(coursesIDs[i]));

		const classesByCourses = courses.reduce((response, course) => {
			
			const result = course.entities
			.map(entities => entities.properties)
			.reduce( (course_classes, course_class) => {
				course_classes.classes.push(course_class.id);
				course_classes.name = course_class.name;
				course_classes.courseId = course_class.courseId;
				return course_classes;
			}, {courseId: 0, name: '', classes: []});
			response.push(result)
			return response;
		}, []);
		
		// Test simulating a user
		const user = await data.loadUser();

		return {user: user, selectedCourses : classesByCourses};
		
	};

	const getProgrammeOffers = async function(programmeId, user){
		const offers = await data.loadAllProgrammeOffers(programmeId);

		const programmeOffersByTerms = offers.entities
		.map(entities => entities.properties)
		.reduce( (offersByTerms, offer) => {
			return offer.termNumber.reduce( (offersByTerms, term) => {
				offersByTerms[term] = offersByTerms[term] || [];
				offersByTerms[term].push(offer);
				return offersByTerms;
			}, offersByTerms);

		}, {});

		return {user: user, programmeOffersByTerms : programmeOffersByTerms , page: "programmeOffers"};
	};

	const getProgrammeData = async function(programmeId, user){
		const programme = await data.loadProgrammeData(programmeId);
		const offers = await getProgrammeOffers(programmeId);

		return {user: user, programmeOffersByTerms: offers.programmeOffersByTerms, programme: programme.properties};
	};

	const getAboutData = async function(user){
		const aboutData = await data.loadAboutData();
		aboutData.projects.map(project => project['image'] = project.name + '.png');
		
		return {
			user: user,
			projects: aboutData.projects, 
			teachers: aboutData.teachers,
			department: aboutData.department,
			departmentImage: aboutData.department + '.png'
		};
	};

	const getPagesCommonInfo = async function(){
		const programmes = await data.loadAllProgrammes();
		// TO DO -> Simplify (do an auxiliar function)
	
		const bachelorProgrammes = programmes.entities
		.filter( entities => entities.properties.degree == "bachelor")
		.map(entities => entities.properties);
	
		const masterProgrammes = programmes.entities
		.filter( entities => entities.properties.degree == "master")
		.map(entities => entities.properties);

		return {bachelor: bachelorProgrammes, master: masterProgrammes};
	};

	const selection = async function(body){

			/// Before: {"1":"1N", "2":["1D","2D"]}

			const newBody = Object.fromEntries(Object.entries(body).map(([k, v]) => {
				const values = Array.isArray(v) ? v : [v]; 
				return [k, values];
			})); 
			
			/// After: {"1":["1N"], "2":["1D","2D"]}

		await data.saveUserCoursesAndClasses(newBody);
	};

	return {
		getHome : getHome,
		getUserSchedule : getUserSchedule,
		getUserCalendar : getUserCalendar,
		getUserCourses : getUserCourses,
		getClasses : getClasses,
		getProgrammeOffers : getProgrammeOffers,
		getProgrammeData : getProgrammeData,
		getAboutData : getAboutData,
		getPagesCommonInfo : getPagesCommonInfo,
		selection : selection
	};
	
}
