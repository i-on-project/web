'use strict'

const jwt_decode = require('jwt-decode');
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
		resave: false,              
		saveUninitialized: false,  
		secret: 'secret',   // TO DO - Generate random string
		cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
		store: new FileStore() 
    }))

	app.use(passport.initialize());
	app.use(passport.session());

    passport.serializeUser(userToRef);
    passport.deserializeUser(refToUser);
    	
    return {

		submitInstitutionalEmail: async function(email) {
			if(!email)  throw internalErrors.BAD_REQUEST;

			const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(email)) throw internalErrors.BAD_REQUEST;
			
			return data.submitInstitutionalEmail(email);
        }, 

		pollingCore: async function(req, authForPoll) {
			const pollingResponse = await data.pollingCore(authForPoll);

			/// Check if pooling succeeded
			if(pollingResponse.hasOwnProperty("access_token")) {

				const tokens = pollingResponse.id_token.split(".");
				const user_email = jwt_decode(tokens[1], { header: true }).email;
				
				const user = await data.loadUser(pollingResponse.access_token, pollingResponse.token_type, user_email);
				const sessionId = await sessionDB.createUserSession(user_email, pollingResponse);
				
				const userSessionInfo = Object.assign(
					{'sessionId': sessionId},
					user,
					pollingResponse
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
			} else if(pollingResponse.hasOwnProperty("error") && pollingResponse.error === "authorization_pending") {
				return false;
			} else {
				throw internalErrors.SERVICE_FAILURE;
			}
		},
		
		logout: async function(req) {
			if(user) {
				const user = req.user;
				
				req.logout();
				req.session.destroy(err => {
					if (err) {
						throw internalErrors.SERVICE_FAILURE;
					}
				})

				await data.revokeAccessToken(user);
				await sessionDB.deleteUserSession(user.sessionId);
			} else {
				throw internalErrors.UNAUTHENTICATED;
			}
		},

		deleteUser: async function(req) {
			const user = JSON.parse(JSON.stringify(req.user));;

			req.logout();
			req.session.destroy(err => { /// TODO : replace ...
				if (err) {
					throw internalErrors.SERVICE_FAILURE;
				}
			});
			
			await data.deleteUser(user);
			await sessionDB.deleteAllUserSessions(user.email);
		}

	}
}

/******* Helper functions *******/

const getUserAndSessionInfo = async function(data, sessionDB, sessionId) { // Through the session identifier we will obtain information about the user as well as the session 
	/// Obtaining user session info from elasticsearch db
	const sessionInfo = await sessionDB.getUserTokens(sessionId);
	
	try { 
		const userProfileInfo = await data.loadUser(sessionInfo.access_token, sessionInfo.token_type, sessionInfo.email);

		return Object.assign(
			{'sessionId': sessionId},
			userProfileInfo,
			sessionInfo
		);

	} catch (err) {

		switch (err) {
			
			case internalErrors.EXPIRED_ACCESS_TOKEN:
				await updateUserSession(data, sessionDB, sessionInfo, sessionId);
				return getUserAndSessionInfo(data, sessionDB, sessionId);

			default:
				throw err;

		}

	}
}

const updateUserSession = async function(data, sessionDB, sessionInfo, sessionId) {// mudar assinatura pra receber o session id e talvez email
	const newTokens = await data.refreshAccessToken(sessionInfo);
	await sessionDB.storeUpdatedInfo(sessionInfo.email, newTokens, sessionId)
}