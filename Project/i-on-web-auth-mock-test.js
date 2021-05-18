'use strict'

const passport = require('passport');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const error = require('./i-on-web-errors.js');

/// todo : Refactor


const FileStore = require('session-file-store')(session); 


function generateSalt () {
    return Math.random().toString(36).substring(2);
}

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

    /// MW para gerir sessões
    app.use(session({
		resave: true,              
		saveUninitialized: false,  
		secret: 'secret-grupo7',   
		store: new FileStore()     
    }))
    
    app.use(passport.initialize());
	app.use(passport.session());

    passport.serializeUser(userToRef);
    passport.deserializeUser(refToUser);
    
    
    return {
		login: async function(req, username, password) {
			if (username && password) {

				const user = await database.getUser(username); 
				
				const generatedHash = crypto
				.createHash('sha256')
				.update(password + user.salt)
				.digest("hex");

				if (user && generatedHash === user.hash) {
					req.login(user, (err) => { 
						if (err) throw error.SERVICE_FAILURE;
					})
				} else throw error.INVALID_CREDENTIALS;

			} else throw error.MISSING_ARGUMENT;
		},

		logout: async function(req) {
			req.logout();
			req.session.destroy(err => { 
				if (err) throw error.SERVICE_FAILURE;
			})
		},

		register: async function(username, password) {
			if (username && password) { 
				const salt = generateSalt();

				const hash = crypto
				.createHash('sha256')
				.update(password + salt)
				.digest("hex");

				await database.createUser(username, hash, salt);
			} else throw error.MISSING_ARGUMENT;
		}
	}

}