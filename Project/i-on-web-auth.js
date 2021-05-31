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
		store: new FileStore(),
		name: 'id',   
    }))

    app.use(passport.initialize());
	app.use(passport.session());

    passport.serializeUser(userToRef);
    passport.deserializeUser(refToUser);
    	
    return {
        getAuthenticationTypes: function() {
            return data.loadAuthenticationTypes();
        },

		getAuthMethodFeatures: async function(type) {
			const receivedData = await data.loadAuthenticationMethodFeatures();
			return receivedData.auth_methods.find(method => method.type == type);
        },

		submitInstitutionalEmail: async function(email) {
			const response = await data.submitInstitutionalEmail(email);
			await database.createUser(email, response.auth_req_id);
			return response;
        }, 

		pollingCore: async function(req, email, authForPoll) {
			const receivedData = await data.pollingCore(authForPoll);
			if(receivedData.hasOwnProperty("access_token")) {
				const user = await database.getUser(email);

				req.login(user, (err) => {
					if (err) throw error.SERVICE_FAILURE;
				})
				
				await database.saveUserTokens(email, authForPoll, receivedData);
				return {
					"polling_success" : true
				};
			} else {
				return {
					"polling_success" : false
				};
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