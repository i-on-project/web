'use strict'

const express = require('express');
const error = require('./i-on-web-errors.js');

function webui(service) {
	
	const theWebUI = {

		home: async function(req, res) { /// Home Page
			try {
				const data = await service.getHomeContent();
				res.render('home', data);
			} catch(err) {
				onError(res, err, 'Failed to show Home Page');
			}
		},

		schedule: async function(req, res) { /// Schedule Page
			try {
				const data = await service.getSchedule();
				res.render('schedule', data);
			} catch(err) {
				onError(res, err, 'Failed to show Schedule');
			}
		},

		calendar: async function(req, res) { /// Calendar Page
			try {
				const data = await service.getCalendar();
				res.render('calendar', data);
			} catch(err) {
				onError(res, err, 'Failed to show Calendar');
			}
		},

		myCourses: async function(req, res) { /// myCourses Page
			try {
				const data = await service.getMyCourses();
				res.render('myCourses', data);
			} catch(err) {
				onError(res, err, 'Failed to show User Courses');
			}
		},

		programmeOffers: async function(req, res) { /// programmeOffers Page
			try {
				const data = await service.getProgrammeOffers(1); // TO DO - Change
				res.render('programmeOffers', data);
			} catch(err) {
				onError(res, err, 'Failed to show Programme Offers');
			}
		},

		programme: async function(req, res) { /// Programme Page
			try {
				const params = req.params;
				const data = await service.getProgrammeData(params['id']);
				res.render('programme', data);
			} catch(err) {
				onError(res, err, 'Failed to show Programme Page');
			}
		},

		about: async function(req, res) { /// About Page
			try {
				const data = await service.getAboutData();
				res.render('about', data);
			} catch(err) {
				onError(res, err, 'Failed to show About Page');
			}
		},

		/******* Authentication Pages *******/
		loginUI: function(req, res) {
			try {	
				res.render('login', {'page': 'login'}); 
			} catch(err) {
				onError(res, err, 'Failed to show Login Page');
			}
		},

		registerUI: function(req, res) {
			try {
				res.render('register');
			} catch(err) {
				onError(res, err, 'Failed to show Login Page');
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
	router.get('/programmeOffers', theWebUI.programmeOffers); /// programmeOffers Page
	router.get('/programme/:id', theWebUI.programme); /// programme Page
	router.get('/about', theWebUI.about); /// About Page
	
	/*** Associate the paths with the respective authentication functions ***/
	router.get('/login', theWebUI.loginUI);
	router.get('/register', theWebUI.registerUI);

	return router;
}

function onError(res, err, defaultError) {
	
	/// Translating application errors to HTTP erros
	switch (err) {
		case error.RESOURCE_NOT_FOUND:
			responseFunction(res, 404, 'Resource Not Found', 'errorPage');
			break;
		default:
			responseFunction(res, 500, 'An error has occured: ' + defaultError, 'errorPage');
			break;
	}
}

function responseFunction(res, status, msg, page) {
	const answer = {'status': status, 'message': msg};
	res.statusCode = answer.status;
	res.render(page, answer);
}

module.exports = webui;

