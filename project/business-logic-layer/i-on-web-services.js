'use strict'

const { FetchError } = require('node-fetch'); // TO DO: removE?
const internalErrors = require('../common/i-on-web-errors.js');

module.exports = function(data, sessionDB) {

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

	const getProgrammeCalendarTermOffers = async function(programmeId, user) { // TO DO: arg semester info
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
		try {
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

			const commonInfo = await getProgrammesByDegree(data);
			return Object.assign(commonInfo, {
				schedule: schedule,
				user: user, 
				page: "schedule"
			});
			
		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return getUserSchedule(user);
				default:
					throw err;
			}
		}
	};

	const getUserEvents = async function(user) {
		try {
			const calendarTerm = await getCurrentCalendarTerm(data);
			let events = {
				"calendar": await data.loadCalendarTermGeneralInfo(calendarTerm),
				"assignments": [],
				"testsAndExams": []
			};

			if(user) {
				const userCourses = await data.loadUserSubscribedCourses(user);
				const userCoursesOfPresentCalendarTerm = userCourses.filter(course => course.calendarTerm === calendarTerm);
				for(let i = 0; i < userCoursesOfPresentCalendarTerm.length; i++) {
					const courseId = userCoursesOfPresentCalendarTerm[i].courseId;
					const courseEvents = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm);
					events.assignments = events.assignments.concat(courseEvents.assignments);
					events.testsAndExams = events.testsAndExams.concat(courseEvents.testsAndExams);
				}
			}
			const commonInfo = await getProgrammesByDegree(data);
			return Object.assign(commonInfo, {
				events: events,
				user: user, 
				page: "calendar"
			});
		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return getUserEvents(user);
				default:
					throw err;
			}
		}
	};

	const getUserCourses = async function(user) {
		try {
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
		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, sessionDBuser);
					return getUserCourses(user);
				default:
					throw err;
			}
		}
	};

	const editUserCourses = async function(user, selectedCoursesAndClassesToDelete) {
		try {
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
		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return editUserCourses(user, selectedCoursesAndClassesToDelete);
				default:
					throw err;
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
		try {
			
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

		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return saveUserChosenCoursesAndClasses(user, selectedClassesAndCourses);
				default:
					throw err;
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

	const getProfilePage = async function(user) {
		const commonInfo = await getProgrammesByDegree(data);
	    //user['programmeName'] = (await data.loadProgrammeData(user.programme)).name;

		return Object.assign(commonInfo, {
			user: user
		});
	};
	
	const editProfile = async function(user, newUserInfo) {
		try {
			
			if(user)
				await data.editUser(user, newUserInfo.newUsername);
	
			const commonInfo = await getProgrammesByDegree(data);
			return Object.assign(commonInfo, {
				user: user
			});

		} catch (err) {

			switch (err) {
				
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return editProfile(user, newUserInfo);

				default:
					throw err;

			}

		}
	};

	const deleteProfile = async function(user) {
		try {
			
			if(user)
				await data.deleteUser(user.access_token, user.token_type);
	
			const commonInfo = await getProgrammesByDegree(data);
			return Object.assign(commonInfo, {
				user: user
			});

		} catch (err) {

			switch (err) {
				
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return deleteProfile(user);

				default:
					throw err;

			}

		}
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
		editProfile : editProfile,
		deleteProfile : deleteProfile
	};
	
}

/******* Helper function *******/

const getCurrentCalendarTerm = async function(data) { 
	const calendarTermObj = await data.loadCurrentCalendarTerm()
	return calendarTermObj.calendarTerm;
}

const getProgrammesByDegree = async function(data){

	const programmes = await data.loadAllProgrammes();

	const bachelorProgrammes = programmes
	.filter( programme => programme.degree == "bachelor");

	const masterProgrammes = programmes
	.filter( programme => programme.degree == "master");

	return {bachelor: bachelorProgrammes, master: masterProgrammes};
};

const updateUserSession = async function(data, sessionDB, user) {
	const newTokens = await data.refreshAccessToken(user);

	await sessionDB.storeUpdatedInfo(user.email, newTokens, user.sessionId)

	user.access_token = newTokens.access_token;
	user.token_type = newTokens.token_type;
	user.refresh_token = newTokens.refresh_token;
	user.expires_in = newTokens.expires_in;
	user.id_token = newTokens.id_token;
}