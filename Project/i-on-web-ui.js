'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');

const getProgrammesList = async function(service){
	return await service.getProgrammesByDegree();
};

function webui(service) {
	
	const theWebUI = {

		home: async function(req, res) { /// Home Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getHomeContent();
				res.render('home', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show Home Page', service);
			}
		},

		schedule: async function(req, res) { /// Schedule Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getSchedule();
				res.render('schedule', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show Schedule', service);
			}
		},

		calendar: async function(req, res) { /// Calendar Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getCalendar();
				res.render('calendar', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show Calendar', service);
			}
		},

		myCourses: async function(req, res) { /// myCourses Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getMyCourses();
				res.render('myCourses', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show User Courses', service);
			}
		},
	
		classes: async function(req, res) { /// classes Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getClasses(req.body);
				res.render('classes', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show Programme Offers', service);
			}
		},

		programmeOffers: async function(req, res) { /// programmeOffers Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getProgrammeOffers(req.params['id']);
				res.render('programmeOffers', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show Programme Offers', service);
			}
		},

		programme: async function(req, res) { /// Programme Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getProgrammeData(req.params['id']);
				res.render('programme', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show Programme Page', service);
			}
		},

		about: async function(req, res) { /// About Page
			try {
				const programmesList = await getProgrammesList(service);
				const data = await service.getAboutData();
				res.render('about', Object.assign(data, programmesList));
			} catch(err) {
				await onError(res, err, 'Failed to show About Page', service);
			}
		},

		settings: async function(req, res) { /// About Page
			try {
				res.render('settings');
			} catch(err) {
				await onError(res, err, 'Failed to show About Page', service);
			}
		},

		/******* Authentication Pages *******/
		loginUI: async function(req, res) {
			try {
				const programmesList = await getProgrammesList(service);	
				res.render('login', Object.assign({'page': 'login'}, programmesList)); 
			} catch(err) {
				await onError(res, err, 'Failed to show Login Page', service);
			}
		},

		registerUI: async function(req, res) {
			try {
				const programmesList = await getProgrammesList(service);
				res.render('register', programmesList);
			} catch(err) {
				await onError(res, err, 'Failed to show Login Page', service);
			}
		}

	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true })) /// MiddleWare to convert html forms in JSON objects

	/******* Associate the paths with the respective functions *******/
	router.get('/', theWebUI.home);	/// Home Page
	router.get('/schedule', theWebUI.schedule);	/// Schedule Page
	router.get('/calendar', theWebUI.calendar);	/// Calendar Page
	router.get('/courses', theWebUI.myCourses); /// myCourses Page
	router.get('/programmeOffers/:id', theWebUI.programmeOffers); /// programmeOffers Page
	router.post('/programmeOffers/:id/classes', theWebUI.classes);
	router.get('/programme/:id', theWebUI.programme); /// programme Page
	router.get('/about', theWebUI.about); /// About Page
	router.get('/settings', theWebUI.settings); /// Settings Page

	/*** Associate the paths with the respective authentication functions ***/
	router.get('/login', theWebUI.loginUI);
	router.get('/register', theWebUI.registerUI);

	return router;
}

async function onError(res, err, defaultError, service) {
	
	/// Translating application errors to HTTP erros
	switch (err) {
		case error.RESOURCE_NOT_FOUND:
			await responseFunction(service, res, 404, 'Resource Not Found', 'errorPage');
			break;
		default:
			await responseFunction(service, res, 500, 'An error has occured: ' + defaultError, 'errorPage');
			break;
	}
}

async function responseFunction(service, res, status, msg, page) {
	const programmesList = await getProgrammesList(service);
	const answer = {'status': status, 'message': msg};
	res.statusCode = answer.status;
	res.render(page, Object.assign(answer, programmesList));
}

module.exports = webui;

