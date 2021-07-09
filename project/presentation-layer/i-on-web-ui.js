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
				await onErrorResponse(res, err, 'Failed to show home page');
			}
		},

		programmeCalendarTermOffers: async function(req, res) {
			try {
				const data = await service.getProgrammeCalendarTermOffers(req.params['id'], req.user);
				res.render('programmeCalendarTermOffers', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show programme offers');
			}
		},

		programme: async function(req, res) {
			try {
				const data = await service.getProgrammeData(req.params['id'], req.user);
				res.render('programme', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show programme page');
			}
		},

		userSchedule: async function(req, res) {
			try {
				const data = await service.getUserSchedule(req.user);
				res.render('user-schedule', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show schedule');
			}
		},

		userCalendar: async function(req, res) {
			try {
				const data = await service.getUserEvents(req.user);
				res.render('user-calendar', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show calendar');
			}
		},

		userClassesAndClassSections: async function(req, res) {
			try {
				const data = await service.getUserSubscribedClassesAndClassSections(req.user);
				res.render('user-classes', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show user courses');
			}
		},

		userClassesAndClassSectionsEdit: async function(req, res) {
			try {
				await service.editUserSubscribedClassesAndClassSections(req.user, req.body);
				res.redirect('/classes');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to edit user classe sections');
			}
		},

		classSectionsFromSelectedClasses: async function(req, res) {
			try {
				const data = await service.getClassSectionsFromSelectedClasses(req.user, req.query['id']);
				res.render('class-sections', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to get class sections from selected classes');
			}
		},

		saveUserClassesAndClassSections: async function(req, res) { 
			try {
				await service.saveUserClassesAndClassSections(req.user, req.body);
				res.redirect('/classes');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to save user classe sections');
			}
		},

		about: async function(req, res) {
			try {
				const data = await service.getAboutData(req.user);
				res.render('about', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show about page');
			}
		},

		profile: async function(req, res) { /// User Profile Page
			try {
				const data = await service.getProfilePage(req.user);
				res.render('user-profile', data);
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to show profile page');
			}
		},

		editProfile: async function(req, res) {
			try {
				await service.editProfile(req.user, req.body);
				res.redirect('/users/profile');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to edit profile');
			}
		},

		deleteUser: async function(req, res) {
			try {
				await auth.deleteUser(req);
				res.redirect('/');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to delete user');
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
				await onErrorResponse(res, err, 'Failed to show login page', commonInfo);
			}
		},

		logout: async function(req, res) {
			try {
				await auth.logout(req);	
				res.redirect('/');
			} catch(err) {
				await onErrorResponse(res, err, 'Failed to logout', commonInfo);
			}
		},
	}

	const router = express.Router();
	router.use(express.urlencoded({ extended: true })) /// MiddleWare to convert html forms in JSON objects

	/******* Mapping requests to handlers according to the path *******/

	router.get(	'/', 						theWebUI.home								);	/// Home page

	router.get(	'/programmes/:id', 			theWebUI.programme							);	/// Programme info page
	router.get(	'/programme-offers/:id',	theWebUI.programmeCalendarTermOffers		); 	/// Programme offers page
	
	router.get(	'/available-class-sections',theWebUI.classSectionsFromSelectedClasses	);	/// Available classes of the selected courses
	router.post('/class-sections', 			theWebUI.saveUserClassesAndClassSections	);

	router.get(	'/classes',					theWebUI.userClassesAndClassSections		); 	/// Users courses page
	router.post('/classes/edit',			theWebUI.userClassesAndClassSectionsEdit	);
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

async function onErrorResponse(res, err, defaultError) {

	const translatedError = appErrorsToHttpErrors(err, defaultError);
	
	res.statusCode = translatedError.status;
	res.render('errorPage', translatedError);

}

function appErrorsToHttpErrors(err, defaultError) {

	switch (err) {
		case internalErrors.BAD_REQUEST:
			return { status: 400, message: 'Bad Request' };
		case internalErrors.RESOURCE_NOT_FOUND:
			return { status: 404, message: 'Resource Not Found' };
		case internalErrors.SERVICE_UNAVAILABLE:
			return { status: 502, message: 'Service Unavailable' }; 
		default:
			return { status: 500, message: `An internal error has occured: ${defaultError}` };
	}
}

module.exports = webui;

