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
				const data = await service.getScheduleContent();
				res.render('schedule', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show Schedule page');
			}
		},

		calendar: async function(req, res) { /// Calendar Page
			try {
				const data = await service.getCalendarContent();
				res.render('calendar', data);
			} catch(err) {
				// TO DO - Handle errors
				console.log('Failed to show Calendar page');
			}
		},

		about: async function(req, res) { /// Calendar Page
			try {
				res.render('about');
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
	router.get('/about', theWebUI.about); /// About Page
	
	/*** Associate the paths with the respective authentication functions ***/
	router.get('/login', theWebUI.loginUI);
	router.get('/register', theWebUI.registerUI);

	return router;
}

module.exports = webui;

