'use strict'

const passport = require('passport');
const session = require('express-session');
const error = require('./i-on-web-errors.js');

const FileStore = require('session-file-store')(session); 

module.exports = (app, data, database) => {

	function userToRef(user, done) {
		done(null, user.email);
	}
	
	async function refToUser(userRef, done) {
		const user = await database.getUser(userRef);
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

		pollingCore: async function(req, email, authForPoll) {
			const receivedData = await data.pollingCore(authForPoll);
			if(receivedData.hasOwnProperty("access_token")) {
				//delete email cookie and request user emails from core ow that we have the access token

				const firstTimeUser = await database.firstTimeUser(email);
				if(firstTimeUser) {
					await database.createUser(email, 1, receivedData);
				} else {
					await database.updateUserTokens(email, receivedData);
				}
				const user = await database.getUser(email);

				req.login(user, (err) => {
					if (err) throw error.SERVICE_FAILURE;
				})
			
				return true;
			} else {
				return false;
			}
		},
		
		logout: async function(req) {
			req.logout();
			req.session.destroy(err => { /// TO DO : replace ...
				if (err) throw error.SERVICE_FAILURE;
			})
		}

	}

}