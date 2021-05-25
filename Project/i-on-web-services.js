'use strict'

const error = require('./i-on-web-errors.js');

module.exports = function(data) {

	const getHome = async function(user) {
		if(user) {
			// TO DO - Show user next events
		}

		return {
			user: user, 
			page: 'home'
		};
	};

	const getProgrammeCalendarTermOffers = async function(programmeId, user){ // TO DO: arg semester info
		const offers = await data.loadAllProgrammeOffers(programmeId);

		// TO DO - For each offer we shall see if there are any existing class
		// for that course in the current calendar term
		const courseIDs = offers.entities
		.map(entities => entities.properties.courseId)
		.filter(courseId => courseId > 0 && courseId < 4) // TO DO - Delete


		/*const programmeCalendarTermOffers = [];
		for(let i = 0; i < courseIDs.length(); i++) {

			const courseClasses = await data.loadCourseClassesByCalendarTerm(courseIDs[i]);

			if(courseClasses.entities.length() != 0) programmeCalendarTermOffers.push(courseClasses);
		}*/


		const filteredCoursesId = [];
		for(let i = 0; i < courseIDs.length; i++) {

			const courseClasses = await data.loadCourseClassesByCalendarTerm(courseIDs[i]);

			if(courseClasses.entities.length != 0) filteredCoursesId.push(courseIDs[i]);
		}

		const programmeCalendarTermOffers = offers
		.filter(entity => entity.properties.courseId.includes(filteredCoursesId))
		
		return {
			user: user,
			programmeCalendarTermOffers : programmeCalendarTermOffers
		};
	};

	const getProgrammeData = async function(programmeId, user){
		const programme = await data.loadProgrammeData(programmeId);
		const offers = await data.loadAllProgrammeOffers(programmeId);

		const offersByAcademicTerms = offers
		.reduce( (offersByTerms, offer) => {
			return offer.termNumber.reduce( (offersByTerms, term) => {
				offersByTerms[term] = offersByTerms[term] || [];
				offersByTerms[term].push(offer);
				return offersByTerms;
			}, offersByTerms);

		}, {});

		return {
			user: user, 
			offersByAcademicTerms: offersByAcademicTerms, 
			programme: programme
		};
	};

	const getUserSchedule = async function(user) {
		if(user) {
			// TO DO - Get user schedule
		}

		return {
			user: user, 
			page: "schedule"
		};
	};

	const getUserCalendar = async function(user) {
		if(user) {
			// TO DO - Get user calendar
		}

		return {
			user: user, 
			page: "calendar"
		};
	};

	const getUserCourses = async function(user) {
		const userCourses = []; 
		if(user) {
			const coursesIDs = Object.keys(user.selectedCoursesAndClasses);

			for(let i = 0; i < coursesIDs.length; i++) {
				const course = await data.loadCourseByID(coursesIDs[i]);
				const newObj = {
					"name": course.entities[0].properties.name,
					"acronym": course.entities[0].properties.acronym,
					"classes": user.selectedCoursesAndClasses[coursesIDs[i]],
					"id": coursesIDs[i]
				};
				userCourses.push(newObj);
			}
		}

		return {
			user: user, 
			userCourses: userCourses, 
			page: "user-courses"
		};
	};

	const saveUserCourses = async function(user, courses){
		if(user) {
			await data.saveUserCourses(user.username, courses);
		}
	};

	const getClasses = async function(selectedCourses, user) {

		// TO DO - Change
		const coursesIDs = selectedCourses
			.reduce((res, curr) => res.concat(curr), [])
			.map(courseId => parseInt(courseId));

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

			response.push(result);

			return response;
		}, []);

		return {
			user: user, 
			classesByCourses: classesByCourses
		};
	};

	const saveUserClasses = async function(user, classes){
		if(user) {
			await data.saveUserClasses(user.username, classes);
		}
	};

	const getAboutData = async function(user){
		const aboutData = await data.loadAboutData();		
	
		return {
			user: user,
			aboutData: aboutData
		};
	};

	const getProgrammesByDegree = async function(){
		const programmes = await data.loadAllProgrammes();

		const bachelorProgrammes = programmes
		.filter( programme => programme.degree == "bachelor");
	
		const masterProgrammes = programmes
		.filter( programme => programme.degree == "master");

		return {bachelor: bachelorProgrammes, master: masterProgrammes};
	};

	return {
		getHome : getHome,
		getProgrammeCalendarTermOffers : getProgrammeCalendarTermOffers,
		getProgrammeData : getProgrammeData,
		getUserSchedule : getUserSchedule,
		getUserCalendar : getUserCalendar,
		getUserCourses : getUserCourses,
		saveUserCourses : saveUserCourses,
		getClasses : getClasses,
		saveUserClasses : saveUserClasses,		
		getAboutData : getAboutData,
		getProgrammesByDegree : getProgrammesByDegree
	};
	
}