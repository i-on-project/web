'use strict'

//const passport = require('passport');
//const session = require('express-session');
//const error = require('./i-on-web-errors.js');

//const FileStore = require('session-file-store')(session); 

module.exports = (app, data) => {

	/*function userToRef(user, done) {
		done(null, user.username);
	}
	
	async function refToUser(userRef, done) {
		const user = await data.getUser(userRef);
		if (user) {
			done(null, user);
		} else {
			done('User not found.');
		}
	}

    /// MW to manage sessions
    app.use(session({
		resave: true,              
		saveUninitialized: false,  
		secret: 'secret',   
		store: new FileStore()     
    }))
    
    app.use(passport.initialize());
	app.use(passport.session());

    passport.serializeUser(userToRef);
    passport.deserializeUser(refToUser);*/
    
    return {
        getAuthenticationTypes: async function() {
            return data.loadAuthenticationTypes();
        },

		getAuthMethodFeatures: async function(type) {
			const receivedData = await data.loadAuthenticationMethodFeatures();
			return receivedData.auth_methods.find(method => method.type == type);
        },

		submitInstitutionalEmail: function(email) {
			return data.submitInstitutionalEmail(email);
        }/*,
		submitMethodResponse: async function(req, email) {
			
            if (email) {
				return await data.sendMethodResponse(email); 

			//	if (user) {
					req.login(user, (err) => { 
						if (err) throw error.SERVICE_FAILURE; /// TO DO: external service error / failure
					})
			//	}

			} else throw error.BAD_REQUEST;
		
        },

        login: async function(req, pollingResponse) {
			
            if (pollingResponse) {
				// TO DO - save in return await data.sendMethodResponse(email); 

///				if (user) {
					req.login(user, (err) => { 
						if (err) throw error.SERVICE_FAILURE; /// ttodo external service error / failure
					})
///				}

			} else throw error.BAD_REQUEST;
		
        },

		logout: async function(req) {
			req.logout();
			req.session.destroy(err => { /// ... todo: replace ...
				if (err) throw error.SERVICE_FAILURE;
			})
		}*/

	}

}