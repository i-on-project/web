'use strict'

const error = require('./i-on-web-errors.js');

const getProgrammesByDegree = async function(data){
	const programmes = await data.loadAllProgrammes();

	const bachelorProgrammes = programmes
	.filter( programme => programme.degree == "bachelor");

	const masterProgrammes = programmes
	.filter( programme => programme.degree == "master");

	return {bachelor: bachelorProgrammes, master: masterProgrammes};
};

module.exports = function(data) {

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

		const filteredCoursesId = [];
		for(let i = 0; i < courseIDs.length; i++) {
			const courseClasses = await data.loadCourseClassesByCalendarTerm(courseIDs[i]);
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
		if(user) {
			// TO DO - Get user schedule
		}

		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
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
		const userCourses = []; 
		if(user) {
			const userCoursesAndClasses = await data.loadUserCoursesAndClasses();

			const courseIDs = Object.keys(userCoursesAndClasses);
	
			for(let i = 0; i < courseIDs.length; i++) {
				const course = await data.loadCourseClassesByCalendarTerm(courseIDs[i]);
				course.classes = userCoursesAndClasses[courseIDs[i]];
				userCourses.push(course)
			}
		}
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user, 
			userCourses: userCourses, 
			page: "user-courses"
		});
	};

	const saveUserCourses = async function(user, courses){
		if(user) {
			await data.saveUserCourses(user.username, courses.selectedCourses);
		}
	};

	const getClassesFromSelectedCourses = async function(user) {
		const classesByCourses = [];
		if(user) {
			const userCourses = await data.loadUserCoursesAndClasses();
	
			// TO DO - Review
			const coursesIDs = Object.keys(userCourses);

			for(let i = 0; i < coursesIDs.length; i++)
				classesByCourses.push(await data.loadCourseClassesByCalendarTerm(coursesIDs[i]));
		}
		
		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user, 
			classesByCourses: classesByCourses
		});
	};

	const saveUserClasses = async function(user, classes){
		if(user) {
			
			const selectedClasses = {}; // TO DO - Review
			for(let prop in classes) { 
				if(!Array.isArray(classes[prop])) {
					selectedClasses[prop] = [classes[prop]];
				} else {
					selectedClasses[prop] = classes[prop];
				}
			}

			await data.saveUserClasses(selectedClasses);
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

	return {
		getHome : getHome,
		getProgrammeCalendarTermOffers : getProgrammeCalendarTermOffers,
		getProgrammeData : getProgrammeData,
		getUserSchedule : getUserSchedule,
		getUserCalendar : getUserCalendar,
		getUserCourses : getUserCourses,
		saveUserCourses : saveUserCourses,
		getClassesFromSelectedCourses : getClassesFromSelectedCourses,
		saveUserClasses : saveUserClasses,		
		getAboutData : getAboutData
	};
	
}
