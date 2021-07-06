'use strict'

const passport = require('passport');
const session = require('express-session');
const internalErrors = require('../common/i-on-web-errors.js');

const FileStore = require('session-file-store')(session); 

module.exports = (app, data, sessionDB) => {

	function userToRef(user, done) {
		done(null, user.sessionId);
	}
	
	async function refToUser(userRef, done) {
		const userSessionInfo = await getUserAndSessionInfo(data, sessionDB, userRef);
	
		if (userSessionInfo) {
			done(null, userSessionInfo);
		} else {
			done('User not found.');
		}

	}

    /// Middleware to manage sessions
    app.use(session({
		resave: true,              
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

			/// Check if pooling succeeded
			if(receivedTokens.hasOwnProperty("access_token")) {

				const user = await data.loadUser(receivedTokens.access_token, receivedTokens.token_type);
				const sessionId = await sessionDB.createUserSession(user.email, receivedTokens);
				
				const userSessionInfo = Object.assign(
					{'sessionId': sessionId},
					user,
					receivedTokens
				);
				
				/// If the user doesn't have a username, we give one by default. 
				if(!userSessionInfo.username) {
					const newUsername = user.email.slice(0, user.email.indexOf("@"));
					userSessionInfo.username = newUsername;
					data.editUser(userSessionInfo, newUsername);
				}
				
				req.login(userSessionInfo, (err) => {
					if (err) throw internalErrors.SERVICE_FAILURE;
				})
				
				return true;
			}
		},
		
		logout: async function(req) {
			const sessionId = req.user.sessionId;
			const user = req.user;
			
			req.logout();
			req.session.destroy(err => { /// TODO : replace ...
				if (err) {
					throw internalErrors.SERVICE_FAILURE;
				}
			})
			await data.revokeAccessToken(user);
			await sessionDB.deleteUserSession(sessionId);
		}
	}

}

/******* Helper functions *******/

const getUserAndSessionInfo = async function(data, sessionDB, sessionId) { // Through the session identifier we will obtain information about the user as well as the session 
	
	/// Obtaining user session info from elasticsearch db
	const sessionInfo = await sessionDB.getUserTokens(sessionId);

	/// Obtaining user profile info from core
	const userProfileInfo = await data.loadUser(sessionInfo.access_token, sessionInfo.token_type);

	return Object.assign(
		{'sessionId': sessionId},
		userProfileInfo,
		sessionInfo
	);
}
