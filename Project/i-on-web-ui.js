'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');

function webui(service) {
	
	const theWebUI = {

		home: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getHome();
				
				res.render('home', Object.assign(data, commonInfo));

			} catch(err) {

				await appErrorsToHttpErrors(res, err, 'Failed to show Home Page', service);

			}
		},

		userSchedule: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getUserSchedule();

				res.render('user-schedule', Object.assign(data, commonInfo));

			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show Schedule', service);
			}
		},

		userCalendar: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getUserCalendar();

				res.render('user-calendar', Object.assign(data, commonInfo));
				
			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show Calendar', service);
			}
		},

		userCourses: async function(req, res) {
			try {
				
				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getUserCourses();

				res.render('user-courses', Object.assign(data, commonInfo));

			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show User Courses', service);
			}
		},
	
		classesOfTheSelectedCourses: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getClasses(req.body); // todo review and change names

				res.render('classes', Object.assign(data, commonInfo));

			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show Programme Offers', service);
			}
		},

		programmeOffers: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getProgrammeOffers(req.params['id']);

				res.render('programmeOffers', Object.assign(data, commonInfo));

			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show Programme Offers', service);
			}
		},

		programme: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getProgrammeData(req.params['id']);

				res.render('programme', Object.assign(data, commonInfo));

			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show Programme Page', service);
			}
		},

		about: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);
				const data = await service.getAboutData();
				
				res.render('about', Object.assign(data, commonInfo));
			
			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show About Page', service);
			}
		},

		settings: async function(req, res) { /// Settings Page
			try {
				
				const commonInfo = await getPageCommonInfo(service);
				res.render('settings', Object.assign(data, commonInfo));

			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show About Page', service);
			}
		},

		finishSelection: async function(req, res) { 
			try {
				
				await service.selection(req.body);
				res.redirect('/courses');

			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show About Page', service);
			}
		},

		/******* Authentication Pages *******/
		loginUI: async function(req, res) {
			try {

				const commonInfo = await getPageCommonInfo(service);	
				res.render('login', Object.assign({'page': 'login'}, commonInfo)); 
			
			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show Login Page', service);
			}
		},

		registerUI: async function(req, res) {
			try {
				
				const commonInfo = await getPageCommonInfo(service);
				res.render('register', commonInfo);
			
			} catch(err) {
				await appErrorsToHttpErrors(res, err, 'Failed to show Register Page', service);
			}
		}
	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true })) /// MiddleWare to convert html forms in JSON objects

	/******* Associate the paths with the respective functions *******/

	router.get(	'/', 						theWebUI.home			);	/// Home Page
	router.get(	'/schedule', 				theWebUI.userSchedule	);	/// Schedule Page
	router.get(	'/calendar', 				theWebUI.userCalendar	);	/// Calendar Page
	router.get(	'/courses',					theWebUI.userCourses	); 	/// myCourses Page
	router.get(	'/programme-offers/:id', 	theWebUI.programmeOffers); 	/// programmeOffers Page
	router.post('/programme-offers/classes',theWebUI.classes		);	/// todo review
	router.get(	'/programme/:id', 			theWebUI.programme		);	/// programme Page
	router.get(	'/about', 					theWebUI.about			);	/// About Page
	router.get(	'/settings', 				theWebUI.settings		);	/// Settings Page
	router.post('/courses', 				theWebUI.finishSelection);
	router.get(	'/login',					theWebUI.loginUI		);
	router.get(	'/register',				theWebUI.registerUI		);

	return router;
}

async function appErrorsToHttpErrors(res, err, defaultError, service) {
	
	/// Translating application errors to HTTP errors
	switch (err) {
		case error.RESOURCE_NOT_FOUND:
			await responseFunction(service, res, 404, 'Resource Not Found', 'errorPage');
			break;
		default:
			await responseFunction(service, res, 500, 'An error has occured: ' + defaultError, 'errorPage');
			break;
	}
}

const getPageCommonInfo = async function(service) {
	return await service.getProgrammesByDegree();
};

async function responseFunction(service, res, status, msg, page) {
	const programmesList = await getPageCommonInfo(service);
	const answer = {'status': status, 'message': msg};
	res.statusCode = answer.status;
	res.render(page, Object.assign(answer, programmesList));
}

module.exports = webui;

