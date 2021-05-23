'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');

function webui(service) {
	
	const theWebUI = {

		home: async function(req, res) {
			try {
				
				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getHome(req.user);
				
				res.render('home', Object.assign(data, commonInfo));

			} catch(err) {

				await onErrorResponse(res, err, 'Failed to show Home Page', service);

			}
		},

		programmeCalendarTermOffers: async function(req, res) {
			try {

				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getProgrammeCalendarTermOffers(req.params['id'], req.user);

				res.render('programmeCalendarTermOffers', Object.assign(data, commonInfo));

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Offers', service);
			}
		},

		programme: async function(req, res) {
			try {

				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getProgrammeData(req.params['id'], req.user);

				res.render('programme', Object.assign(data, commonInfo));

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Programme Page', service);
			}
		},

		userSchedule: async function(req, res) {
			try {

				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getUserSchedule(req.user);

				res.render('user-schedule', Object.assign(data, commonInfo));

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Schedule', service);
			}
		},

		userCalendar: async function(req, res) {
			try {

				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getUserCalendar(req.user);

				res.render('user-calendar', Object.assign(data, commonInfo));
				
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Calendar', service);
			}
		},

		userCourses: async function(req, res) {
			try {
				
				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getUserCourses(req.user);
			
				res.render('user-courses', Object.assign(data, commonInfo));

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show User Courses', service);
			}
		},

		saveUserChosenCourses: async function(req, res) { 
			try {
				
				await service.saveUserCourses(req.user, req.body);
				res.redirect('/courses');

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page', service);
			}
		},
	
		getClassesFromSelectedCourses: async function(req, res) {
			try {

				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getClasses(req.body, req.user); // todo review and change names

				res.render('classes', Object.assign(data, commonInfo));

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Programme Offers', service);
			}
		},

		saveUserChosenClasses: async function(req, res) { 
			try {
				
				await service.saveUserClasses(req.user,req.body);
				res.redirect('/courses');

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page', service);
			}
		},

		about: async function(req, res) {
			try {

				const commonInfo = await getPagesCommonInfo(service);
				const data = await service.getAboutData(req.user);
				
				res.render('about', Object.assign(data, commonInfo));
			
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page', service);
			}
		},

		settings: async function(req, res) { /// Settings Page
			try {
				
				const commonInfo = await getPagesCommonInfo(service);
				res.render('settings', Object.assign(data, commonInfo));

			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show About Page', service);
			}
		},

		/******* Authentication Pages *******/
		loginUI: async function(req, res) {
			try {

				const commonInfo = await getPagesCommonInfo(service);	
				res.render('login', Object.assign({'page': 'login'}, commonInfo)); 
			
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Login Page', service);
			}
		},

		registerUI: async function(req, res) {
			try {
				
				const commonInfo = await getPagesCommonInfo(service);
				res.render('register', commonInfo);
			
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show Register Page', service);
			}
		}

	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true })) /// MiddleWare to convert html forms in JSON objects

	/******* Mapping requests to handlers according to the path *******/

	router.get(	'/', 					theWebUI.home			);	/// Home page

	router.get(	'/programme/:id', 		theWebUI.programme		);	/// Programme info page
	router.get(	'/programme-offers/:id',theWebUI.programmeCalendarTermOffers); 	/// Programme offers page
	
	router.post('/courses',				theWebUI.saveUserChosenCourses			);	/// todo create method
	router.get(	'/available-classes',	theWebUI.getClassesFromSelectedCourses	);	/// todo list available)
	router.post('/classes', 			theWebUI.saveUserChosenClasses			);	/// todo review

	router.get(	'/courses',				theWebUI.userCourses	); 	/// Users courses page
	router.get(	'/schedule', 			theWebUI.userSchedule	);	/// Users schedule page
	router.get(	'/calendar', 			theWebUI.userCalendar	);	/// Users calendar page

	router.get(	'/about', 				theWebUI.about			);	/// About Page
	router.get(	'/settings', 			theWebUI.settings		);	/// Settings Page

	/*** Auth ***/	
	router.get(	'/login',				theWebUI.loginUI		);	/// Login UI page
	router.get(	'/register',			theWebUI.registerUI		);	/// Register UI page

	return router;
}


/******* Helper functions *******/

/// This function returns data that is common between multiples pages (e.g. programmes to show in navbar)
async function getPagesCommonInfo(service) {
	return await service.getProgrammesByDegree();
};

async function onErrorResponse(res, err, defaultError, commonInfo) {

	const translatedError = appErrorsToHttpErrors(err, defaultError);
	
	res.statusCode = translatedError.status;
	res.render(page, Object.assign(translatedError, commonInfo));

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

