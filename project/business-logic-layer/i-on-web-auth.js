'use strict'

const passport = require('passport');
const session = require('express-session');
const internalErrors = require('../common/i-on-web-errors.js');

const FileStore = require('session-file-store')(session); 

module.exports = (app, data, sessionDB) => {

	function userToRef(user, done) {
		done(null, user.email);
	}
	
	async function refToUser(userRef, done) {
		/// Obtaining user profile info from core
		const userProfileInfo = data.loadUser(userRef);

		/// Obtaining user session info from elasticsearch db
		const userSession = await sessionDB.getUser(userRef);

		// es request -> tokens
		if (user) {
			done(null, user);
		} else {
			done('User not found.');
		}
	}

    /// MW to manage sessions
    app.use(session({
		resave: false,              
		saveUninitialized: false,  
		secret: 'secret',   // TO DO - Generate random string
		store: new FileStore({logFn: function(){}}),
		name: 'id',   
    }))

    app.use(passport.initialize());
	app.use(passport.session());

    passport.serializeUser(userToRef);
    passport.deserializeUser(refToUser);
    	
    return {

		getAuthMethodsAndFeatures: async function() {
			return data.loadAuthenticationMethodsAndFeatures();
        },

		submitInstitutionalEmail: async function(email) {
			return data.submitInstitutionalEmail(email);
        }, 

		pollingCore: async function(req, authForPoll) {
			const receivedTokens = await data.pollingCore(authForPoll);

			if(receivedTokens.hasOwnProperty("access_token")) {
				const user = await data.loadUser(receivedTokens);
				user.username = user.username ? user.username : user.email.slice(0, user.email.indexOf("@"));
				data.editUser(user);
				/**
				 * edit username with prefix if not set...
				 */

				const firstTimeUser = await sessionDB.firstTimeUser(user.email);
				if(firstTimeUser) {
					await sessionDB.createUser(user.email, 1, receivedTokens);
				} else {
					await sessionDB.updateUserTokens(user.email, receivedTokens);
				}
				const i_on_web_user = await sessionDB.getUser(user.email);
				
				req.login(i_on_web_user, (err) => {
					if (err) throw internalErrors.SERVICE_FAILURE;
				})
			
				return true;
			} else {
				return false;
			}
		},
		
		logout: async function(req) {
			await data.revokeAccessToken(req.user);
			req.logout();
			req.session.destroy(err => { /// TODO : replace ...
				if (err) throw internalErrors.SERVICE_FAILURE;
			})
		}
	}

}

/* ,
	getUsername: async function(user) {
		return user.username? user.username : user.email.slice(0, user.email.indexOf("@"));
	}
 */