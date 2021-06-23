'use strict'

const express = require('express');
const internalErrors = require('../common/i-on-web-errors.js');

function webui(service, auth) {
	
	const theWebUI = {

		home: async function(req, res) {
			try {
				const data = await service.getHome(req.user);
				res.render('home', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Home Page');
			}
		},

		programmeCalendarTermOffers: async function(req, res) {
			try {
				const data = await service.getProgrammeCalendarTermOffers(req.params['id'], req.user);
				res.render('programmeCalendarTermOffers', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Offers');
			}
		},

		programme: async function(req, res) {
			try {
				const data = await service.getProgrammeData(req.params['id'], req.user);
				res.render('programme', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Programme Page');
			}
		},

		userSchedule: async function(req, res) {
			try {
				const data = await service.getUserSchedule(req.user);
				res.render('user-schedule', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Schedule');
			}
		},

		userCalendar: async function(req, res) {
			try {
				const data = await service.getUserEvents(req.user);
				res.render('user-calendar', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Calendar');
			}
		},

		userCourses: async function(req, res) {
			try {
				const data = await service.getUserCourses(req.user);
				res.render('user-courses', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show User Courses');
			}
		},

		userCoursesEditUI: async function(req, res) {
			try {
				const data = await service.getUserCourses(req.user);
				res.render('user-courses-edit', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show User Courses');
			}
		},

		userCoursesEdit: async function(req, res) {
			try {
				await service.editUserCourses(req.user, req.body);
				res.redirect('/courses');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show User Courses');
			}
		},

		classesFromSelectedCourses: async function(req, res) {
			try {
				const data = await service.getClassesFromSelectedCourses(req.user, req.query['id']);
				res.render('classes', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Programme Offers');
			}
		},

		saveUserChosenCoursesAndClasses: async function(req, res) { 
			try {
				await service.saveUserChosenCoursesAndClasses(req.user, req.body);
				res.redirect('/courses');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page');
			}
		},

		about: async function(req, res) {
			try {
				const data = await service.getAboutData(req.user);
				res.render('about', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page');
			}
		},

		profile: async function(req, res) { /// User Profile Page
			try {
				const data = await service.getProfilePage(req.user);
				res.render('user-profile', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page');
			}
		},

		editProfile: async function(req, res) {
			try {
				await service.editProfile(req.user, req.body);
				res.redirect('/profile');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page');
			}
		},

		/******* Authentication Pages *******/
		loginUI: async function(req, res) {
			let commonInfo;
			try {
				//commonInfo = await getPagesCommonInfo(service);
				const data = await auth.getAuthMethodsAndFeatures();
				res.render( /// TO DO: create page
					'login',
					Object.assign(
						{'page': 'login'},
						commonInfo,
						{'data': data}
					)
				);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Login Page', commonInfo);
			}
		},

		logout: async function(req, res) {
			try {
				await auth.logout(req);	
				res.redirect('/'); 
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Login Page', commonInfo);
			}
		},
	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true })) /// MiddleWare to convert html forms in JSON objects

	/******* Mapping requests to handlers according to the path *******/

	router.get(	'/', 					theWebUI.home							);	/// Home page

	router.get(	'/programme/:id', 		theWebUI.programme						);	/// Programme info page
	router.get(	'/programme-offers/:id',theWebUI.programmeCalendarTermOffers	); 	/// Programme offers page
	
	router.get(	'/available-classes',	theWebUI.classesFromSelectedCourses		);		/// Available classes of the selected courses
	router.post('/classes', 			theWebUI.saveUserChosenCoursesAndClasses);	/// todo review

	router.get(	'/courses',				theWebUI.userCourses					); 	/// Users courses page
	router.get(	'/courses/edit',		theWebUI.userCoursesEditUI				);
	router.post('/courses/edit',		theWebUI.userCoursesEdit				);
	router.get(	'/schedule', 			theWebUI.userSchedule					);	/// Users schedule page
	router.get(	'/calendar', 			theWebUI.userCalendar					);	/// Users calendar page

	router.get(	'/about', 				theWebUI.about							);	/// About Page
	router.get( '/profile', 			theWebUI.profile						);  /// User Profile Page
	router.post('/profile', 			theWebUI.editProfile					);

	/*** Auth ***/
	router.get(	'/login',				theWebUI.loginUI			);	/// Login UI page
	router.get('/logout',				theWebUI.logout			);

	return router;
}


/******* Helper functions *******/

async function onErrorResponse(res, err, defaultError) {

	const translatedError = appErrorsToHttpErrors(err, defaultError);
	
	res.statusCode = translatedError.status;
	res.render(page, translatedError);

}

function appErrorsToHttpErrors(err, defaultError) {

	switch (err) {
		case internalErrors.BAD_REQUEST:
			return { status: 400, message: 'Bad Request' };
		case internalErrors.RESOURCE_NOT_FOUND:
			return { status: 404, message: 'Resource Not Found' };
		default:
			return { status: 500, message: `An error has occured: ${defaultError} errorPage` };
	}
}

module.exports = webui;

