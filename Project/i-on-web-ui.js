'use strict'

const express = require('express');

function webui(service) {
	
	const theWebUI = {

		home: async function(req, res) { /// Home Page
			try {
				const data = await service.getHomeContent();
				res.render('home', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show Home page');
			}
		},

		schedule: async function(req, res) { /// Schedule Page
			try {
				const data = await service.getSchedule();
				res.render('schedule', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show Schedule page');
			}
		},

		calendar: async function(req, res) { /// Calendar Page
			try {
				const data = await service.getCalendar();
				res.render('calendar', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show Calendar page');
			}
		},

		myCourses: async function(req, res) { /// myCourses Page
			try {
				const data = await service.getMyCourses();
				res.render('myCourses', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show myCourses page');
			}
		},

		programmeOffers: async function(req, res) { /// programmeOffers Page
			try {
				const data = await service.getProgrammeOffers();
				res.render('programmeOffers', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show programmeOffers page');
			}
		},

		programme: async function(req, res) { /// Programme Page
			try {
				const params = req.params;
				const data = await service.getProgrammeData(params['id']);
				res.render('programme', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show Programme page');
			}
		},

		about: async function(req, res) { /// Calendar Page
			try {
				const data = await service.getAboutData();
				res.render('about', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show Calendar page');
			}
		},

		/******* Authentication Pages *******/
		loginUI: function(req, res) {
			res.render('login', {'page': 'login'}); 
		},

		registerUI: function(req, res) {
			res.render('register'); 
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

module.exports = webui;

