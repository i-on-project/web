'use strict'

const internalErrors = require('../common/i-on-web-errors.js');
const pathPrefix = process.env.PATH_PREFIX || "";

module.exports = function(data, sessionDB) {

	const getHome = async function(user) {
		try {

			let events;

			if(user) { // If there is an active session

				/// Obtaining calendar term e.g., 2020-2021-2
				const currentCalendarTerm = await getCurrentCalendarTerm(data);

				events = await getUserEvents(data, user, currentCalendarTerm);

				const currentDate = new Date().getTime();

				/// Filtering by date the events previously obtained
				const filterOldEvents = event => {
					const date = event.date.split('-');
					const eventDate = new Date(date[0], date[1]-1, date[2]).getTime();
					return eventDate >= currentDate;
				};

				events.assignments = events.assignments.filter(filterOldEvents);
				events.testsAndExams = events.testsAndExams.filter(filterOldEvents);
			}

			const commonInfo = await getProgrammesByDegree(data);

			return Object.assign(
				commonInfo,
				{
					user: user,
					pathPrefix : pathPrefix,
					events: events
				}
			);

		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return getHome(user);
				default:
					throw err;
			}
		}
	};

	const getProgrammeData = async function(user, programmeId) {

		if(!isIdValid(programmeId)) throw internalErrors.BAD_REQUEST;

		const programme = await data.loadProgramme(programmeId);

		/// Creating an object in which each property will contain the programme offers associated with the academic term
		programme.offers = programme.offers
			.reduce( (offersByTerms, offer) => {

				return offer.termNumber
					.reduce( (offersByTerms, term) => {
						offersByTerms[term] = offersByTerms[term] || [];
						offersByTerms[term].push(offer);
						return offersByTerms;
					}, offersByTerms);

			}, {});

		const commonInfo = await getProgrammesByDegree(data);

		return Object.assign(
			commonInfo,
			{
				user: user,
				pathPrefix : pathPrefix,
				programme: programme
			}
		);
	};

	const getProgrammeOffers = async function(user, programmeId) {

		if(!isIdValid(programmeId)) throw internalErrors.BAD_REQUEST;

		if(user) {

			/// Obtaining programme offers course ids
			const programme = await data.loadProgramme(programmeId);

			const offersCourseIds = programme.offers
				.map(offer => offer.courseId)
				.filter(courseId => courseId > 0); // Due to core inconsistencies, remove later
			
			const calendarTerm = await getCurrentCalendarTerm(data);

			/// Check if there are class sections for the course contained in the programme offer (in the current calendar term)
			const filteredCoursesId = [];
			for(const courseId of offersCourseIds) {
				const classObj = await data.loadClassByCalendarTerm(courseId, calendarTerm);
				if(classObj.classSections.length !== 0)
					filteredCoursesId.push(courseId);
			}

			/// Obtaining only the offers that have class sections
			const programmeOffers = programme.offers
				.filter(course => filteredCoursesId.includes(course.courseId));
		
			const commonInfo = await getProgrammesByDegree(data);
			
			return Object.assign(
				commonInfo,
				{
					user: user,
					pathPrefix : pathPrefix,
					programmeOffers: programmeOffers
				}
			);

		} else {
			throw internalErrors.UNAUTHENTICATED;
		}

	};

	const getUserSchedule = async function(user) {
		try {
			
			let schedule = [];

			if(user) {
				/// Obtaining calendar term e.g., 2020-2021-2
				const calendarTerm = await getCurrentCalendarTerm(data);

				/// Obtain and filter the user subscriptions in order to obtain only the ones from the current calendar term
				const userSubscriptions = await data.getUserSubscriptions(user);
				const userCurrentCalendarTermSubscriptions = userSubscriptions.filter(userClass => userClass.calendarTerm === calendarTerm);
				
				for(const subscription of userCurrentCalendarTermSubscriptions) {
					const courseId = subscription.courseId;
					const classSections = subscription.classes;
					
					/*	For each user subscription we obtain the courseId along with the class sections associated
						Then we procceed to obtain the schedule for each one of the class sections, placing it in the array
						'schedule' along with the acronym and classSection it is associated with
					*/

					for(const classSectionElem of classSections) {
						const classSectionSchedule = await data.loadClassSectionSchedule(courseId, calendarTerm, classSectionElem);

						schedule = schedule
							.concat(classSectionSchedule
								.map(classSection => {
									classSection['acronym'] = subscription.acronym;
									classSection['classSection'] = classSectionElem;
									return classSection;
								})
							);
					}
				}
			}

			const commonInfo = await getProgrammesByDegree(data);

			return Object.assign(
				commonInfo,
				{
					user: user,
					pathPrefix : pathPrefix,
					schedule: schedule
				}
			);
			
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
			/// Obtaining calendar term e.g., 2020-2021-2
			const calendarTerm = await getCurrentCalendarTerm(data);

			/// Specific events of the calendar term e.g., start and end date of exams 
			const calendarEvents = await data.loadCalendarTermGeneralInfo(calendarTerm);

			let events = {
				"calendar": calendarEvents,
				"assignments": [],
				"testsAndExams": []
			};
			
			/// If a user is authenticated, we shall get his own events according to his courses
			if(user) {
				const userEvents = await getUserEvents(data, user, calendarTerm);
				events.assignments = userEvents.assignments;
				events.testsAndExams = userEvents.testsAndExams;
			}
			
			const commonInfo = await getProgrammesByDegree(data);
			
			return Object.assign(
				commonInfo,
				{
					user: user,
					pathPrefix : pathPrefix,
					events: events
				}
			);
			
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

	const getUserSubscriptions = async function(user) {
		try {
			let userSubscriptionsFinal = [];

			if(user) {
				
				/// Obtaining user subscriptions in current calendar term 
				const calendarTerm = await getCurrentCalendarTerm(data);
				const userSubscriptions = await data.getUserSubscriptions(user);

				const userCurrentCalendarTermSubscriptions = userSubscriptions.filter(userClass => userClass.calendarTerm === calendarTerm);

				/// In order to obtain the name of each subscription
				for(const subscription of userCurrentCalendarTermSubscriptions) {
					const classObj = await data.loadClassByCalendarTerm(subscription.courseId , calendarTerm);
					subscription['name'] = classObj.name;
				}

				userSubscriptionsFinal = userCurrentCalendarTermSubscriptions;
			}
		
			const commonInfo = await getProgrammesByDegree(data);
			
			return Object.assign(
				commonInfo,
				{
					user: user,
					pathPrefix : pathPrefix,
					userClasses: userSubscriptionsFinal
				}
			);

		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, sessionDBuser);
					return getUserSubscriptions(user);
				default:
					throw err;
			}
		}
	};

	const deleteUserSubscriptions = async function(user, selectedSubscriptions) {

		try {
			if(user) {

				for(const classId in selectedSubscriptions) {

					/// Check if the class id is valid and if it has class sections
					if(!isIdValid(classId) || !selectedSubscriptions[classId]) throw internalErrors.BAD_REQUEST;

					if(Array.isArray(selectedSubscriptions[classId])) { /// If the user wants to unsubscribe to multiple class sections

						for(const classSection of selectedSubscriptions[classId])
							await data.deleteUserSubscriptions(user, classId, classSection);

					} else { /// If the user wants to unsubscribe to a single class section

						await data.deleteUserSubscriptions(user, classId, selectedSubscriptions[classId]);
					
					}

					const classes = await data.loadUserSubscribedClassSectionsInClass(user, classId);
					if(classes.length === 0) /// If the user is no longer subscribed to any class section then we can also unsubscribe to the associated class
						await data.deleteUserClass(user, classId);
				}

			} else {
				throw internalErrors.UNAUTHENTICATED;
			}

		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return deleteUserSubscriptions(user, selectedSubscriptions);
				default:
					throw err;
			}
		}
	}

	const getClassSectionsFromSelectedClasses = async function(user, courseIds) {

		if(user) {

			/// Validations
			if(!courseIds) throw internalErrors.BAD_REQUEST;

			const classeSectionsByClass = [];
			
			const calendarTerm = await getCurrentCalendarTerm(data);

			/**** Get class sections for each class id ****/
			if(Array.isArray(courseIds)) {

				for(const courseId of courseIds) {
					if(!isIdValid(courseId)) throw internalErrors.BAD_REQUEST; // Check if the classes ids are valid 
					classeSectionsByClass.push(await data.loadClassByCalendarTerm(courseId, calendarTerm));
				}

			} else classeSectionsByClass.push(await data.loadClassByCalendarTerm(courseIds, calendarTerm));
		

			/**** Get user subscribed Classes ****/
			const userSubscriptions = await data.getUserSubscriptions(user);
			const userCurrentCalendarTermSubscriptions = userSubscriptions.filter(userClass => userClass.calendarTerm === calendarTerm);

			/// In order to obtain the name of each subscription
			for(const subscription of userCurrentCalendarTermSubscriptions) {
				const course = await data.loadClassByCalendarTerm(subscription.courseId , calendarTerm);
				subscription['name'] = course.name;
			}

			/// Discard classes whose class ids and course ids have not been selected.
			const userSubscribedClasses = userCurrentCalendarTermSubscriptions
				.filter(userClass => {
					return classeSectionsByClass.some(selectedClass => selectedClass.id === userClass.id && selectedClass.courseId === userClass.courseId);
				});
			
			const commonInfo = await getProgrammesByDegree(data);

			return Object.assign(
				commonInfo, 
				{
					user: user, 
					pathPrefix : pathPrefix,
					classeSectionsByClass: classeSectionsByClass,
					userSubscribedClasses : userSubscribedClasses
				}
			);

		} else {
			throw internalErrors.UNAUTHENTICATED;
		}

	};

	const saveUserSubscriptions = async function(user, selectedClassesAndClassSections) {
		try {
			// selectedClassesAndClassSections e.g. format: {"42":"LEIRT61D","46":["LEIRT41D","LI61N"],"50":"LEIRT21D"} 
			// where 42, 46 and 50 are the ids and LEIRT61D, ... and LEIRT21D are the class sections
			if(user) {

				for(const classId in selectedClassesAndClassSections) {
					
					// Check if the class id is valid and if it has class sections
					if(!isIdValid(classId) || !selectedClassesAndClassSections[classId]) throw internalErrors.BAD_REQUEST;

					if(Array.isArray(selectedClassesAndClassSections[classId])) {
						for(const classSection of selectedClassesAndClassSections[classId]) { 
							await data.saveUserSubscriptions(user, classId, classSection);
						}
							
					} else {
						await data.saveUserSubscriptions(user, classId, selectedClassesAndClassSections[classId]);
					}
				}

			} else {
				throw internalErrors.UNAUTHENTICATED;
			}

		} catch (err) {
			switch (err) {
				case internalErrors.EXPIRED_ACCESS_TOKEN:
					await updateUserSession(data, sessionDB, user);
					return saveUserSubscriptions(user, selectedClassesAndClassSections);
				default:
					throw err;
			}
		}
	};

	const getAboutData = async function(user) {
		const aboutData = await data.loadAboutData();		

		const commonInfo = await getProgrammesByDegree(data);

		return Object.assign(
			commonInfo, 
			{
				user: user, 
				pathPrefix : pathPrefix,
				aboutData: aboutData
			}
		);
	};

	const getProfilePage = async function(user) {
		if(user) {

			const commonInfo = await getProgrammesByDegree(data);

			return Object.assign(
				commonInfo, 
				{
					user: user, 
					pathPrefix : pathPrefix
				}
			);

		} else {
			throw internalErrors.UNAUTHENTICATED;
		}
	};
	
	const editProfile = async function(user, newUserInfo) {
		try {
			
			if(user) {

				if(!newUserInfo || !newUserInfo.newUsername) throw internalErrors.BAD_REQUEST;
				await data.editUser(user, newUserInfo.newUsername);

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
			commonInfo, 
			{
				pathPrefix : pathPrefix,
				'data': authMethods
			}
		);
	};


	return {
		getHome : getHome,
		getProgrammeData : getProgrammeData,
		getProgrammeOffers : getProgrammeOffers,
		getUserSchedule : getUserSchedule,
		getUserCalendar : getUserCalendar,
		getUserSubscriptions : getUserSubscriptions,
		deleteUserSubscriptions : deleteUserSubscriptions,
		getClassSectionsFromSelectedClasses : getClassSectionsFromSelectedClasses,
		saveUserSubscriptions : saveUserSubscriptions,		
		getAboutData : getAboutData,
		getProfilePage : getProfilePage,
		editProfile : editProfile,
		getAuthMethodsAndFeatures : getAuthMethodsAndFeatures
	};
	
}

/******* Helper functions *******/

const getUserEvents = async function(data, user, calendarTerm) {
	const userSubscriptions = await data.getUserSubscriptions(user);

	// Filtering classes by current calendar term and removing repeated classes
	const userCurrentCalendarTermSubscriptions = userSubscriptions
		.filter(userClass => userClass.calendarTerm === calendarTerm)
		.reduce((subscriptions, currentSub) => {
			if(!subscriptions.some(subscription => subscription.courseId === currentSub.courseId && subscription.id === currentSub.id)) 
				subscriptions.push(currentSub);
			
			return subscriptions;
		}, []);

	const userEvents = {
		"assignments": [],
		"testsAndExams": []
	};

	for(let i = 0; i < userCurrentCalendarTermSubscriptions.length; i++) {
		const courseId = userCurrentCalendarTermSubscriptions[i].courseId;
		const classEvents = await data.loadCourseEventsInCalendarTerm(courseId, calendarTerm);

		userEvents.assignments = userEvents.assignments.concat(classEvents.assignments);
		userEvents.testsAndExams = userEvents.testsAndExams.concat(classEvents.testsAndExams);
	}

	return userEvents;
};

const getCurrentCalendarTerm = async function(data) { 
	const calendarTerm = await data.loadCalendarTerm(); 
	return calendarTerm.currentCalendarTerm;
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
	return typeof(numberId) === 'number' && Math.round(numberId) === numberId && numberId >= 0;
}