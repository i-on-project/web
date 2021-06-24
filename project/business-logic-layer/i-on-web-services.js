'use strict'

const internalErrors = require('../common/i-on-web-errors.js');

module.exports = function(data, database) {

	const getHome = async function(user) {
		if(user) {
			// TO DO - Show user next events
		}
		const commonInfo = await getProgrammesByDegree(data);
		const events = await getUserEvents(user);

		return Object.assign(commonInfo, 
			{
				events: events.events,
				user: user, 
				page: 'home'
			}
		);
	};

	const getProgrammeCalendarTermOffers = async function(programmeId, user){ // TO DO: arg semester info
		const offers = await data.loadAllProgrammeOffers(programmeId);

		const courseIDs = offers
		.map(offer => offer.courseId)
		.filter(courseId => courseId > 0 && courseId < 4) // TO DO - Delete

		const calendarTerm = await getCurrentCalendarTerm(data);

		const filteredCoursesId = [];
		for(let i = 0; i < courseIDs.length; i++) {
			const courseClasses = await data.loadCourseClassesByCalendarTerm(courseIDs[i], calendarTerm);
			if(courseClasses.classes.length != 0) filteredCoursesId.push(courseIDs[i]);
		}

		const programmeCalendarTermOffers = offers
		.filter(course => filteredCoursesId.includes(course.courseId))

		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign({
			user: user,
			programmeCalendarTermOffers : programmeCalendarTermOffers
		}, commonInfo);
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

		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user, 
			offersByAcademicTerms: offersByAcademicTerms, 
			programme: programme
		});
	};

	const getUserSchedule = async function(user) {
		let schedule = [];
		if(user) {
			const calendarTerm = await getCurrentCalendarTerm(data);
			const userCourses = await data.loadUserSubscribedCourses(user);
			const userCoursesOfPresentCalendarTerm = userCourses.filter(course => course.calendarTerm === calendarTerm);
			
			for(let i = 0; i < userCoursesOfPresentCalendarTerm.length; i++) {
				const courseId = userCoursesOfPresentCalendarTerm[i].courseId;
				const classes = await data.loadUserSubscribedClassesInCourse(user, courseId);

				for(let j = 0; j < classes.length; j++) {
					const classSectionSchedule = await data.loadClassSectionSchedule(courseId, calendarTerm, classes[j])
					schedule = schedule.concat(classSectionSchedule.map(classSection => {
						classSection['acronym'] = userCoursesOfPresentCalendarTerm[i].acronym;
						classSection['classSection'] = classes[j];
						return classSection;
					}));
				}
			}
		}
		// Test
		
		/*
		schedule = [
			{"startDate":"10:00","endDate":"12:30","location":"G.2.1","weekday":"MO","acronym":"SL","classSection":"1D"},
			{"startDate":"10:00","endDate":"12:30","location":"G.2.4","weekday":"WE","acronym":"SL","classSection":"1D"},
			{"startDate":"08:00","endDate":"11:00","location":"G.2.1","weekday":"TU","acronym":"DAW","classSection":"2D"},
			{"startDate":"09:00","endDate":"12:00","location":"C.2.4","weekday":"FR","acronym":"GAP","classSection":"3D"},
			{"startDate":"10:00","endDate":"13:00","location":"C.2.4","weekday":"FR","acronym":"PI","classSection":"1D"}]
		*/
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			schedule: schedule,
			user: user, 
			page: "schedule"
		});
	};

	const getUserEvents = async function(user) {
		let events = {
			"assignments": [],
			"testsAndExams": []
		};

		if(user) {
			const calendarTerm = await getCurrentCalendarTerm(data);
			const userCourses = await data.loadUserSubscribedCourses(user);
			const userCoursesOfPresentCalendarTerm = userCourses.filter(course => course.calendarTerm === calendarTerm);
			for(let i = 0; i < userCoursesOfPresentCalendarTerm.length; i++) {
				const courseId = userCoursesOfPresentCalendarTerm[i].courseId;
				const courseEvents = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm);
				events.assignments = events.assignments.concat(courseEvents.assignments);
				events.testsAndExams = events.testsAndExams.concat(courseEvents.testsAndExams);
			}
		}

		// Test
		/*events = {
			"assignments": [
			{"event": "Trabalho de GAP", "date":"2021-06-11" , "time":"13:30"}, 
			{"event": "Trabalho de CN", "date":"2021-06-11", "time":"19:30"}, 
			{"event": "Trabalho de DAW", "date":"2021-06-17", "time":"11:00"}, 
			{"event": "Trabalho de PI", "date":"2021-06-21", "time":"18:30"}, 
			{"event": "Trabalho de SS", "date":"2021-06-22", "time":"18:30"}, 
			{"event": "Exame de AC", "date":"2021-06-26", "time":"18:30"}
		],
			"testsAndExams": [
				{"event": "Teste de GAP", "date":"2021-06-11" , "starTime":"10:30", "endTime":"12:30", "location":"G.2.14"},
				{"event": "Teste de PI", "date":"2021-06-22" , "starTime":"09:30", "endTime":"12:30", "location":"G.2.14"},
				{"event": "Teste de DAW", "date":"2021-06-28" , "starTime":"18:30", "endTime":"21:30", "location":"G.2.10"}
			]
		};*/

		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			events: events,
			user: user, 
			page: "calendar"
		});
	};

	const getUserCourses = async function(user) {
		const userCoursesAndClasses = []; 
		if(user) {
			const calendarTerm = await getCurrentCalendarTerm(data);
			const userCourses = await data.loadUserSubscribedCourses(user);
			const userCoursesOfPresentCalendarTerm = userCourses.filter(course => course.calendarTerm === calendarTerm);
			
			for(let i = 0; i < userCoursesOfPresentCalendarTerm.length; i++) {
				const course = await data.loadCourseClassesByCalendarTerm(userCoursesOfPresentCalendarTerm[i].courseId , calendarTerm)
				const classes = await data.loadUserSubscribedClassesInCourse(user, userCoursesOfPresentCalendarTerm[i].courseId);
				course.classes = classes;
				userCoursesAndClasses.push(course);
			}
		}
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user, 
			userCoursesAndClasses: userCoursesAndClasses, 
			page: "user-courses"
		});
	};

	const editUserCourses = async function(user, selectedCoursesAndClassesToDelete) {
		if(user) {
			for(let courseId in selectedCoursesAndClassesToDelete) {
				if(Array.isArray(selectedCoursesAndClassesToDelete[courseId])) {
					for(let i = 0; i < selectedCoursesAndClassesToDelete[courseId].length; i++)
						await data.deleteUserClass(user, courseId, selectedCoursesAndClassesToDelete[courseId][i]);
				} else {
					await data.deleteUserClass(user, courseId, selectedCoursesAndClassesToDelete[courseId]);

				}
				const classes = await data.loadUserSubscribedClassesInCourse(user, courseId);
				if(classes.length === 0)
					await data.deleteUserCourse(user, courseId);
			}
		}
	}

	const getClassesFromSelectedCourses = async function(user, coursesIDs) {
		const classesByCourses = [];
		if(user) {
			if(Array.isArray(coursesIDs)) {
				for(let i = 0; i < coursesIDs.length; i++)
					classesByCourses.push(await data.loadCourseClassesByCalendarTerm(coursesIDs[i], '1718i')); // TO DO - remove harcoded calendarTerm
			} else {
				classesByCourses.push(await data.loadCourseClassesByCalendarTerm(coursesIDs, '1718i'));
			}
		}

		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user, 
			classesByCourses: classesByCourses
		});
	};

	const saveUserChosenCoursesAndClasses = async function(user, selectedClassesAndCourses){
		if(user) {
			for(let courseId in selectedClassesAndCourses) {
				if(Array.isArray(selectedClassesAndCourses[courseId])) {
					for(let i = 0; i < selectedClassesAndCourses[courseId].length; i++) 
						await data.saveUserChosenCoursesAndClasses(user, courseId, selectedClassesAndCourses[courseId][i]);
				} else {
					await data.saveUserChosenCoursesAndClasses(user, courseId, selectedClassesAndCourses[courseId]);
				}
			}
			
		}
	};

	const getAboutData = async function(user){
		const aboutData = await data.loadAboutData();		
	
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user,
			aboutData: aboutData
		});
	};

	const getProfilePage = async function(user){
		const commonInfo = await getProgrammesByDegree(data);
		user['programmeName'] = (await data.loadProgrammeData(user.programme)).name;

		return Object.assign(commonInfo, {
			user: user
		});
	};
	
	const editProfile = async function(user, newUserInfo) {
		if(user) {
			await data.editUser(user, newUserInfo.newUsername);
			await database.editUser(user.email, newUserInfo.newUsername, Number(newUserInfo.newProgramme));
		}
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user
		});
	};

	return {
		getHome : getHome,
		getProgrammeCalendarTermOffers : getProgrammeCalendarTermOffers,
		getProgrammeData : getProgrammeData,
		getUserSchedule : getUserSchedule,
		getUserEvents : getUserEvents,
		getUserCourses : getUserCourses,
		editUserCourses : editUserCourses,
		getClassesFromSelectedCourses : getClassesFromSelectedCourses,
		saveUserChosenCoursesAndClasses : saveUserChosenCoursesAndClasses,		
		getAboutData : getAboutData,
		getProfilePage : getProfilePage,
		editProfile : editProfile
	};
	
}

/******* Helper function *******/

const getCurrentCalendarTerm = async function(data) { 
	return '1718i'; // TO DO
}

const getProgrammesByDegree = async function(data){

	const programmes = await data.loadAllProgrammes();

	const bachelorProgrammes = programmes
	.filter( programme => programme.degree == "bachelor");

	const masterProgrammes = programmes
	.filter( programme => programme.degree == "master");

	return {bachelor: bachelorProgrammes, master: masterProgrammes};
};