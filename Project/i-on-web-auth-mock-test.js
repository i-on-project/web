'use strict'

const passport = require('passport');
const session = require('express-session');
const error = require('./i-on-web-errors.js');

const FileStore = require('session-file-store')(session); 

module.exports = (app, database) => { 

	function userToRef(user, done) {
		done(null, user.username);
	}
	
	async function refToUser(userRef, done) {

		const user = await database.getUser(userRef);
		if (user) {
			done(null, user);
		} else {
			done('User unknown');
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
    passport.deserializeUser(refToUser);
    
    
    return {
		login: async function(req, username) {
			if (username) {

				const user = await database.getUser(username); 

				if (user) {
					req.login(user, (err) => { 
						if (err) throw error.SERVICE_FAILURE;
					})
				}

			} else throw error.BAD_REQUEST;
		},

		logout: async function(req) {
			req.logout();
			req.session.destroy(err => { 
				if (err) throw error.SERVICE_FAILURE;
			})
		},

		register: async function(username) {
			if (username) { 
				await database.createUser(username);
			} else throw error.BAD_REQUEST;
		}
	}

}