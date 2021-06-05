'use strict'

const error = require('./i-on-web-errors.js');

module.exports = function(data, database) {

	const getHome = async function(user) {
		if(user) {
			// TO DO - Show user next events
		}
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, 
			{
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

		const calendarTerm = "1718v"; // TO DO

		const filteredCoursesId = [];
		for(let i = 0; i < courseIDs.length; i++) {
			const courseClasses = await data.loadCourseClassesByCalendarTerm(courseIDs[i], calendarTerm) ;
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
			const calendarTerm = '1718v'; // TO DO
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
		/*schedule = [
			{"startDate":"10:00","endDate":"12:30","location":"G.2.1","weekday":"MO","acronym":"SL","classSection":"1D"},
			{"startDate":"10:00","endDate":"12:30","location":"G.2.4","weekday":"WE","acronym":"SL","classSection":"1D"},
			{"startDate":"08:00","endDate":"11:00","location":"G.2.1","weekday":"TU","acronym":"DAW","classSection":"2D"},
			{"startDate":"09:00","endDate":"12:00","location":"C.2.4","weekday":"FR","acronym":"GAP","classSection":"3D"},
			{"startDate":"10:00","endDate":"13:00","location":"C.2.4","weekday":"FR","acronym":"PI","classSection":"1D"}]*/

			
		console.log("test --> " + JSON.stringify(schedule));
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			schedule: schedule,
			user: user, 
			page: "schedule"
		});
	};

	const getUserCalendar = async function(user) {
		if(user) {
			// TO DO - Get user calendar
		}

		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user, 
			page: "calendar"
		});
	};

	const getUserCourses = async function(user) {
		const userCoursesAndClasses = []; 
		if(user) {
			const calendarTerm = '1718v'; // TO DO
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

	const getSettingsPage = async function(user){
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user
		});
	};
	
	const editSettings = async function(user, newUsername) {
		if(user) {
			await data.editUser(user, newUsername.name);
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
		getUserCalendar : getUserCalendar,
		getUserCourses : getUserCourses,
		editUserCourses : editUserCourses,
		getClassesFromSelectedCourses : getClassesFromSelectedCourses,
		saveUserChosenCoursesAndClasses : saveUserChosenCoursesAndClasses,		
		getAboutData : getAboutData,
		getSettingsPage : getSettingsPage,
		editSettings : editSettings
	};
	
}

/******* Helper function *******/
const getProgrammesByDegree = async function(data){

	const programmes = await data.loadAllProgrammes();

	const bachelorProgrammes = programmes
	.filter( programme => programme.degree == "bachelor");

	const masterProgrammes = programmes
	.filter( programme => programme.degree == "master");

	return {bachelor: bachelorProgrammes, master: masterProgrammes};
};