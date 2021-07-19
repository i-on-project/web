'use strict'

const internalErrors = require('../common/i-on-web-errors.js');

module.exports = function(data, sessionDB) {

	/**
	 * ... todo
	 * @param {*} user an object that represents the user and its session.
	 * @returns an object with user events, user info, page and information common to multiple pages.
	 */
	const getHome = async function(user) {
		let events;

		if(user) { // If there is an active session

			const currentCalendarTerm = await getCurrentCalendarTerm(data);
			events = await getUserEvents(data, user, currentCalendarTerm);

			const currentDate = new Date().getTime();

			const filterOldEvents = event => {
				const date = event.date.split('-');
				const eventDate = new Date(date[0], date[1]-1, date[2]).getTime();
				return eventDate > currentDate
			};

			events.assignments = events.assignments.filter(filterOldEvents);
			events.testsAndExams = events.testsAndExams.filter(filterOldEvents);
		}

		const commonInfo = await getProgrammesByDegree(data);

		return Object.assign(
			commonInfo,
			{
				events: events,
				user: user, 
				page: 'home'
			}
		);

	};

	const getProgrammeOffers = async function(programmeId, user) {

		if(!isIdValid(programmeId)) throw internalErrors.BAD_REQUEST;

		if(user) {
			const offers = await data.loadAllProgrammeOffers(programmeId);

			const courseIDs = offers
			.map(offer => offer.courseId)
			//.filter(courseId => courseId > 0 && courseId < 4) // TO DO - Delete

			const calendarTerm = await getCurrentCalendarTerm(data);

			const filteredCoursesId = [];
			for(let i = 0; i < courseIDs.length; i++) {
				const courseClasses = await data.loadCourseClassesByCalendarTerm(courseIDs[i], calendarTerm);
				if(courseClasses.classes.length != 0) filteredCoursesId.push(courseIDs[i]);
			}

			const programmeOffers = offers
				.filter(course => filteredCoursesId.includes(course.courseId))

			const commonInfo = await getProgrammesByDegree(data);
			return Object.assign({
				user: user,
				programmeOffers : programmeOffers
			}, commonInfo);
		} else {
			throw internalErrors.UNAUTHENTICATED;
		}
	};

	const getProgrammeData = async function(programmeId, user) {

		if(!isIdValid(programmeId)) throw internalErrors.BAD_REQUEST;

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
				const userClassesAndClassSections = await data.loadUserSubscribedClassesAndClassSections(user);
				const userClassesOfPresentCalendarTerm = userClassesAndClassSections.filter(userClass => userClass.calendarTerm === calendarTerm);
				
				for(let i = 0; i < userClassesOfPresentCalendarTerm.length; i++) {
					const courseId = userClassesOfPresentCalendarTerm[i].courseId;
					const classes = userClassesOfPresentCalendarTerm[i].classes;

					for(let j = 0; j < classes.length; j++) {
						const classSectionSchedule = await data.loadClassSectionSchedule(courseId, calendarTerm, classes[j])
						schedule = schedule.concat(classSectionSchedule.map(classSection => {
							classSection['acronym'] = userClassesOfPresentCalendarTerm[i].acronym;
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

	const getUserCalendar = async function(user) {
		try {
			// Obtaining calendar term e.g., 2021v
			const calendarTerm = await getCurrentCalendarTerm(data);
			
			// Specific events of the calendar term e.g., start and end date of exams 
			const calendarEvents = await data.loadCalendarTermGeneralInfo(calendarTerm);
	
			let events = {
				"calendar": calendarEvents,
				"assignments": [],
				"testsAndExams": []
			};
	
			// If a user is authenticated, we shall get his own events according to his courses
			if(user) {
				const calendarTerm = await getCurrentCalendarTerm(data);
				const userEvents = await getUserEvents(data, user, calendarTerm);
				events.assignments = userEvents.assignments;
				events.testsAndExams = userEvents.testsAndExams;
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
					return getUserCalendar(user);
				default:
					throw err;
			}
		}
	};

	const getUserSubscribedClassesAndClassSections = async function(user) {
		try {
			let userClasses = [];
			if(user) {
				const calendarTerm = await getCurrentCalendarTerm(data);
				const userClassesAndClassSections = await data.loadUserSubscribedClassesAndClassSections(user);
				const userClassesOfPresentCalendarTerm = userClassesAndClassSections.filter(userClass => userClass.calendarTerm === calendarTerm);

				for(let i = 0; i < userClassesOfPresentCalendarTerm.length; i++) {
					const course = await data.loadCourseClassesByCalendarTerm(userClassesOfPresentCalendarTerm[i].courseId , calendarTerm)
					const userClass = userClassesOfPresentCalendarTerm[i];
					userClass['name'] = course.name;
				}
				userClasses = userClassesOfPresentCalendarTerm;
			}
		
			const commonInfo = await getProgrammesByDegree(data);
			return Object.assign(commonInfo, {
				user: user, 
				userClasses: userClasses, 
				page: "user-courses"
			});

		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, sessionDBuser);
					return getUserSubscribedClassesAndClassSections(user);
				default:
					throw err;
			}
		}
	};

	const editUserSubscribedClassesAndClassSections = async function(user, selectedClassesAndClassSections) {

		try {
			if(user) {
				for(let classId in selectedClassesAndClassSections) {

					// Check if the class id is valid and if it has class sections
					if(!isIdValid(classId) || !selectedClassesAndClassSections[classId]) throw internalErrors.BAD_REQUEST;

					if(Array.isArray(selectedClassesAndClassSections[classId])) {
						for(let i = 0; i < selectedClassesAndClassSections[classId].length; i++)
							await data.deleteUserClassSection(user, classId, selectedClassesAndClassSections[classId][i]);
					} else {
						await data.deleteUserClassSection(user, classId, selectedClassesAndClassSections[classId]);
					}
					const classes = await data.loadUserSubscribedClassSectionsInClass(user, classId);
					if(classes.length === 0)
						await data.deleteUserClass(user, classId);
				}
			} else {
				throw internalErrors.UNAUTHENTICATED;
			}
		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return editUserSubscribedClassesAndClassSections(user, selectedCoursesAndClassesToDelete);
				default:
					throw err;
			}
		}
	}

	const getClassSectionsFromSelectedClasses = async function(user, classesIds) {

		/* Validations */

		if(!classesIds) throw internalErrors.BAD_REQUEST;

		const classeSectionsByClass = [];
		let userClasses;

		if(user) {
			
			const calendarTerm = await getCurrentCalendarTerm(data);

			/**** Get class sections for each class id ****/
			if(Array.isArray(classesIds)) {

				for(let i = 0; i < classesIds.length; i++) {
					if(!isIdValid(classesIds[i])) throw internalErrors.BAD_REQUEST; // Check if the classes ids are valid 
					classeSectionsByClass.push(await data.loadCourseClassesByCalendarTerm(classesIds[i], calendarTerm));
				}

			} else classeSectionsByClass.push(await data.loadCourseClassesByCalendarTerm(classesIds, calendarTerm));
		

			/**** Get user subscribed Classes ****/
			const userClassesAndClassSections = await data.loadUserSubscribedClassesAndClassSections(user);
			const userClassesOfPresentCalendarTerm = userClassesAndClassSections.filter(userClass => userClass.calendarTerm === calendarTerm);

			for(let i = 0; i < userClassesOfPresentCalendarTerm.length; i++) {
				const course = await data.loadCourseClassesByCalendarTerm(userClassesOfPresentCalendarTerm[i].courseId , calendarTerm)
				const userClass = userClassesOfPresentCalendarTerm[i];
				userClass['name'] = course.name;
			}

			userClasses = userClassesOfPresentCalendarTerm
			.filter(userClass => {
				return classeSectionsByClass.some(selectedClass => selectedClass.id === userClass.id && selectedClass.courseId === userClass.courseId);
			})

		}
		
		const commonInfo = await getProgrammesByDegree(data);

		return Object.assign(
			commonInfo, 
			{
				user: user, 
				classeSectionsByClass: classeSectionsByClass,
				userSubscribedClasses : userClasses
			}
		);

	};

	const saveUserClassesAndClassSections = async function(user, selectedClassesAndClassSections) {

		try {

			if(user) {

				for(let classId in selectedClassesAndClassSections) {
					
					// Check if the class id is valid and if it has class sections
					if(!isIdValid(classId) || !selectedClassesAndClassSections[classId]) throw internalErrors.BAD_REQUEST;

					if(Array.isArray(selectedClassesAndClassSections[classId])) {
						for(let i = 0; i < selectedClassesAndClassSections[classId].length; i++) 
							await data.saveUserClassesAndClassSections(user, classId, selectedClassesAndClassSections[classId][i]);
					} else {
						await data.saveUserClassesAndClassSections(user, classId, selectedClassesAndClassSections[classId]);
					}
				}

			} else {
				throw internalErrors.UNAUTHENTICATED;
			}

		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return saveUserClassesAndClassSections(user, selectedClassesAndClassSections);
				default:
					throw err;
			}
		}
	};

	const getAboutData = async function(user) {
		const aboutData = await data.loadAboutData();		

		const commonInfo = await getProgrammesByDegree(data);
		return Object.assign(commonInfo, {
			user: user,
			aboutData: aboutData
		});
	};

	const getProfilePage = async function(user) {
		if(user) {
			const commonInfo = await getProgrammesByDegree(data);
			//user['programmeName'] = (await data.loadProgrammeData(user.programme)).name;

			return Object.assign(commonInfo, {
				user: user
			});
		} else {
			throw internalErrors.UNAUTHENTICATED;
		}
	};
	
	const editProfile = async function(user, newUserInfo) {
		try {
		
			if(user) {
				if(!newUserInfo || !newUserInfo.newUsername) throw internalErrors.BAD_REQUEST;
				await data.editUser(user, newUserInfo.newUsername);
	
				const commonInfo = await getProgrammesByDegree(data);
				return Object.assign(commonInfo, {
					user: user
				});
			} else {
				throw internalErrors.UNAUTHENTICATED;
			}

		} catch (err) {

			switch (err) {
				
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return editProfile(user, newUserInfo);

				default:
					throw err;

			}

		};

	};

	const getAuthMethodsAndFeatures = async function() {
		const authMethods = await data.loadAuthenticationMethodsAndFeatures();
		const commonInfo = await getProgrammesByDegree(data);
		
		return Object.assign(
			{'page': 'login'},
			commonInfo,
			{'data': authMethods}
		);
	};


	return {
		getHome : getHome,
		getProgrammeOffers : getProgrammeOffers,
		getProgrammeData : getProgrammeData,
		getUserSchedule : getUserSchedule,
		getUserCalendar : getUserCalendar,
		getUserSubscribedClassesAndClassSections : getUserSubscribedClassesAndClassSections,
		editUserSubscribedClassesAndClassSections : editUserSubscribedClassesAndClassSections,
		getClassSectionsFromSelectedClasses : getClassSectionsFromSelectedClasses,
		saveUserClassesAndClassSections : saveUserClassesAndClassSections,		
		getAboutData : getAboutData,
		getProfilePage : getProfilePage,
		editProfile : editProfile,
		getAuthMethodsAndFeatures : getAuthMethodsAndFeatures
	};
	
}

/******* Helper functions *******/

const getUserEvents = async function(data, user, calendarTerm) {
	const userClassesAndClassSections = await data.loadUserSubscribedClassesAndClassSections(user);

	// filtering classes by current calendar term
	const userClassesOfCurrentCalendarTerm = userClassesAndClassSections.filter(
		userClass => userClass.calendarTerm === calendarTerm
	);

	const userEvents = {
		"assignments": [],
		"testsAndExams": []
	};

	for(let i = 0; i < userClassesOfCurrentCalendarTerm.length; i++) {
		const courseId = userClassesOfCurrentCalendarTerm[i].courseId;
		const classEvents = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm);

		userEvents.assignments = userEvents.assignments.concat(classEvents.assignments);
		userEvents.testsAndExams = userEvents.testsAndExams.concat(classEvents.testsAndExams);
	}

	return userEvents;
};

const getCurrentCalendarTerm = function(data) { 
	return data.loadCurrentCalendarTerm(); // todo change loadCurrentCalendarTerm remove current 
}

const getProgrammesByDegree = async function(data) {
	const programmes = await data.loadAllProgrammes();

	const bachelorProgrammes = programmes
	.filter( programme => programme.degree == "bachelor");

	const masterProgrammes = programmes
	.filter( programme => programme.degree == "master");

	return {bachelor: bachelorProgrammes, master: masterProgrammes};
};

const updateUserSession = async function(data, sessionsDb, user) {
	const newTokens = await data.refreshAccessToken(user);
	await sessionsDb.storeUpdatedInfo(user.email, newTokens, user.sessionId);

	user.access_token	= newTokens.access_token;
	user.token_type		= newTokens.token_type;
	user.refresh_token	= newTokens.refresh_token;
	user.expires_in		= newTokens.expires_in;
	user.id_token		= newTokens.id_token;
};

function isIdValid(id) {
	const numberId = Number(id);
	return typeof(numberId) === 'number' && Math.round(numberId) === numberId && numberId > 0;
}