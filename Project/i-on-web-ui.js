'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');

function webui(service, auth) {
	
	const theWebUI = {

		home: async function(req, res) {
			try {
				const data = await service.getHome(req.user);
				console.log(`[WebUi] - Received: ${JSON.stringify(data)}`)
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
				const data = await service.getUserCalendar(req.user);
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

		saveUserChosenCourses: async function(req, res) { 
			try {
				await service.saveUserCourses(req.user, req.body);
				res.redirect('/available-classes');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page');
			}
		},
	
		classesFromSelectedCourses: async function(req, res) {
			try {
				const data = await service.getClassesFromSelectedCourses(req.user); // todo review and change names
				res.render('classes',data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Programme Offers');
			}
		},

		saveUserChosenClasses: async function(req, res) { 
			try {
				await service.saveUserClasses(req.user,req.body);
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

		settings: async function(req, res) { /// Settings Page
			try {
				// TO DO
				res.render('settings', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page');
			}
		},

		/******* Authentication Pages *******/
		getAuthTypes: async function(req, res) {
			let commonInfo;
			try {
				//commonInfo = await getPagesCommonInfo(service);	
				const data = await auth.getAuthenticationTypes();
				
				res.render(
					'auth_methods',
					Object.assign(
						{'page': 'login'},
						commonInfo,
						data
					)
				);
			
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Login Page', commonInfo);
			}
		},

		loginUI: async function(req, res) {
			const args = req.query;
			let commonInfo;

			try {

				//commonInfo = await getPagesCommonInfo(service);
				const data = await auth.getAuthMethodFeatures(args['type']);
				
				res.render( /// TO DO: create page
					'login',
					Object.assign(
						{'page': 'login'},
						commonInfo,
						data
					)
				);
			
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Login Page', commonInfo);
			}
		},

		login: async function(req, res) {
			let commonInfo;
			try {

				//commonInfo = await getPagesCommonInfo(service);	
				const data = await auth.getAuthenticationMethods();
				
				res.render(
					'login',
					Object.assign(
						{'page': 'login'},
						commonInfo,
						data
					)
				); 
			
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Login Page', commonInfo);
			}
		}

	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true })) /// MiddleWare to convert html forms in JSON objects

	/******* Mapping requests to handlers according to the path *******/

	router.get(	'/', 					theWebUI.home			);	/// Home page

	router.get(	'/programme/:id', 		theWebUI.programme		);	/// Programme info page
	router.get(	'/programme-offers/:id',theWebUI.programmeCalendarTermOffers); 	/// Programme offers page
	
	router.post('/courses',				theWebUI.saveUserChosenCourses			);	/// todo review
	router.get(	'/available-classes',	theWebUI.classesFromSelectedCourses	);		/// Available classes of the selected courses
	router.post('/classes', 			theWebUI.saveUserChosenClasses			);	/// todo review

	router.get(	'/courses',				theWebUI.userCourses	); 	/// Users courses page
	router.get(	'/schedule', 			theWebUI.userSchedule	);	/// Users schedule page
	router.get(	'/calendar', 			theWebUI.userCalendar	);	/// Users calendar page

	router.get(	'/about', 				theWebUI.about			);	/// About Page
	router.get(	'/settings', 			theWebUI.settings		);	/// Settings Page

	/*** Auth ***/
	router.get(	'/auth-methods',		theWebUI.getAuthTypes	);	/// Authentication methods page
	router.get(	'/login',				theWebUI.loginUI		);	/// Login UI page
	router.post('/login',				theWebUI.login			);	/// Submission page

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
		case error.BAD_REQUEST:
			return { status: 400, message: 'Bad Request' };
		case error.RESOURCE_NOT_FOUND:
			return { status: 404, message: 'Resource Not Found' };
		default:
			return { status: 500, message: `An error has occured: ${defaultError} errorPage` };
	}
}

module.exports = webui;

