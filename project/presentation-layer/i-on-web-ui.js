'use strict'

const express = require('express');
const internalErrors = require('../common/i-on-web-errors.js');
const pathPrefix = process.env.PATH_PREFIX || "";

function webui(service, auth) {
	
	const theWebUI = {

		home: async function(req, res) {
			try {
				const data = await service.getHome(req.user);
				res.render('home', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show home page');
			}
		},

		programmeOffers: async function(req, res) {
			try {
				const data = await service.getProgrammeOffers(req.params['id'], req.user);
				res.render('programmeOffers', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show programme offers');
			}
		},

		programme: async function(req, res) {
			try {
				const data = await service.getProgrammeData(req.params['id'], req.user);
				res.render('programme', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show programme page');
			}
		},

		userSchedule: async function(req, res) {
			try {
				const data = await service.getUserSchedule(req.user);
				res.render('user-schedule', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show schedule');
			}
		},

		userCalendar: async function(req, res) {
			try {
				const data = await service.getUserCalendar(req.user);
				res.render('user-calendar', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show calendar');
			}
		},

		userClassesAndClassSections: async function(req, res) {
			try {
				const data = await service.getUserSubscribedClassesAndClassSections(req.user);
				res.render('user-classes', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show user courses');
			}
		},

		userClassesAndClassSectionsEdit: async function(req, res) {
			try {
				await service.editUserSubscribedClassesAndClassSections(req.user, req.body);
				res.redirect(pathPrefix + '/subscriptions');
			} catch(err) {
				onError(req, res, err, 'Failed to edit user classe sections');
			}
		},

		classSectionsFromSelectedClasses: async function(req, res) {
			try {
				const data = await service.getClassSectionsFromSelectedClasses(req.user, req.query['id']);
				res.render('class-sections', data);
			} catch(err) {
				onError(req, res, err, 'Failed to get class sections from selected classes');
			}
		},

		saveUserClassesAndClassSections: async function(req, res) { 
			try {
				await service.saveUserClassesAndClassSections(req.user, req.body);
				res.redirect(pathPrefix + '/subscriptions');
			} catch(err) {
				onError(req, res, err, 'Failed to save user classe sections');
			}
		},

		about: async function(req, res) {
			try {
				const data = await service.getAboutData(req.user);
				res.render('about', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show about page');
			}
		},

		profile: async function(req, res) { /// User Profile Page
			try {
				const data = await service.getProfilePage(req.user);
				res.render('user-profile', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show profile page');
			}
		},

		editProfile: async function(req, res) {
			try {
				await service.editProfile(req.user, req.body);
				res.redirect(pathPrefix + '/users/profile');
			} catch(err) {
				onError(req, res, err, 'Failed to edit profile');
			}
		},

		deleteUser: async function(req, res) {
			try {
				await auth.deleteUser(req);
				res.redirect(pathPrefix + '/');
			} catch(err) {
				onError(req, res, err, 'Failed to delete user');
			}
		},

		/******* Authentication Pages *******/
		loginUI: async function(req, res) {
			try {
				const data = await service.getAuthMethodsAndFeatures();
				res.render('login', data);
			} catch(err) {
				onError(req, res, err, 'Failed to show login page', commonInfo);
			}
		},

		logout: async function(req, res) {
			try {
				await auth.logout(req);	
				res.redirect(pathPrefix + '/');
			} catch(err) {
				onError(req, res, err, 'Failed to logout', commonInfo);
			}
		},
	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true })) /// MiddleWare to convert html forms in JSON objects

	/******* Mapping requests to handlers according to the path *******/

	router.get(	'/', 						theWebUI.home								);	/// Home page

	router.get(	'/programmes/:id', 			theWebUI.programme							);	/// Programme info page
	router.get(	'/programmes/:id/offers',	theWebUI.programmeOffers					); 	/// Programme offers page
	
	router.get('/class-sections',			theWebUI.classSectionsFromSelectedClasses	);	/// Available classes of the selected courses
	
	router.post('/subscriptions', 			theWebUI.saveUserClassesAndClassSections	);
	router.get(	'/subscriptions',			theWebUI.userClassesAndClassSections		); 	/// Users courses page
	router.post('/classes-sections/delete',	theWebUI.userClassesAndClassSectionsEdit	);
	
	router.get(	'/schedule', 				theWebUI.userSchedule						);	/// Users schedule page
	router.get(	'/calendar', 				theWebUI.userCalendar						);	/// Users calendar page

	router.get(	'/about', 					theWebUI.about								);	/// About Page
	router.get( '/users/profile', 			theWebUI.profile							);  /// User Profile Page
	router.post('/users/profile', 			theWebUI.editProfile						);
	router.post('/users/delete',        	theWebUI.deleteUser							);

	/*** Auth ***/

	router.get(	'/login',					theWebUI.loginUI			   				);	/// Login UI page
	router.get(	'/logout',					theWebUI.logout								);

	return router;
}


/******* Helper functions *******/

function onError(req, res, err, defaultError) {

	// Translates internal errors to HTTP errors

	switch (err) {
		case internalErrors.UNAUTHENTICATED:
			res.status(401).redirect(pathPrefix + '/login');
			break;
		case internalErrors.BAD_REQUEST:
			return res.status(400).render('errorPage', { status: 400, errorMessage: 'Bad Request', user: req.user});
		case internalErrors.RESOURCE_NOT_FOUND:
			return res.status(400).render('errorPage', { status: 404, errorMessage: 'Resource Not Found', user: req.user });
		case internalErrors.SERVICE_UNAVAILABLE:
			return res.status(400).render('errorPage', { status: 502, errorMessage: 'Service Unavailable', user: req.user }); 
		default:
			return res.status(400).render('errorPage', { status: 500, errorMessage: `An internal error has occured: ${defaultError}`, user: req.user });
	}

}

module.exports = webui;

