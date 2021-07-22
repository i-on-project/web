'use strict'

const frisby = require('frisby');
const fetch = require('node-fetch');
const setCookieParser = require('set-cookie-parser');
//const Joi = frisby.Joi;

const app_base_url = 'http://localhost:8080/'; // TO DO port and prefix generic
const db_base_url = process.env.DB_ELASTIC_URL;

//const storageCreator = require('../covida-db-elastic.js');
//const database = storageCreator('localhost', 9200);

let cookie;

const cheerio = require('cheerio');


const manageIndex = async function() {
	/*** Sessions Index ***/
	const usersDeleteResponse = await fetch(`${db_base_url}/sessions`, { method: 'DELETE' });
	if(usersDeleteResponse.status != 200 && usersDeleteResponse.status != 404) throw usersDeleteResponse.status;

	const usersPutResponse = await fetch(`${db_base_url}/sessions`, { method: 'PUT' });
	if(usersPutResponse.status != 200 && usersPutResponse.status != 201) throw usersPutResponse.status;
};

beforeAll(async function () {

	try {
		await manageIndex();
	} catch (err) { console.log('An unexpected error occurred'); }

});

afterAll(async function () { 
	
	try {
		await manageIndex();
	} catch (err) { console.log('An unexpected error occurred'); }

});

describe(`Integration tests on ${app_base_url}`, () => {
	/// Verificar se o servidor está a correr
	describe('Checking if server is running', () => {
		test ('the server must be running', () => {
			return frisby.get(`${app_base_url}/`);
		});
	});

	describe("Testing '/'", () => {
		
		describe('GET /', () => {
		
			it ('should return the home page', () => {
				return frisby
					.fetch(`${app_base_url}/`)
					.then(data => {
						const $ = cheerio.load(data.body);
						expect($("head [charset]").attr("charset")).toBe("utf-8");
					})
					.expect('status', 200)
					.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});

		});

	});

	describe("Testing '/programmes/:id'", () => {
		
		describe('GET /programmes/:id', () => {
		
			it ('should return programme info page', () => {
				return frisby
				.fetch(`${app_base_url}/programmes/1`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

	describe("Testing '/programmes/:id/offers'", () => {
		
		describe('GET /programmes/:id/offers', () => {
		
			it ('should return programme offers page', () => {
				return frisby
				.fetch(`${app_base_url}/programmes/:id/offers`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

	describe("Testing '/subscriptions'", () => {
		
		describe('GET /subscriptions', () => {
			
			it ('should return the available class sections of the selected classes', () => {
				return frisby
				.fetch(`${app_base_url}/subscriptions`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

	describe("Testing '/subscriptions'", () => {
		
		describe('GET /subscriptions', () => {
		
			it ('should return the user subscribed classes and class sections', () => {
				return frisby
				.fetch(`${app_base_url}/classes`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

	describe("Testing '/classes/edit'", () => {
		
		describe('GET /classes/edit', () => {
		
			it ('should return the user subscribed classes and class sections', () => {
				return frisby
				.fetch(`${app_base_url}/classes/edit`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

	describe("Testing '/schedule'", () => {
		
		describe('GET /schedule', () => {
		
			it ('should return the user schedule', () => {
				return frisby
				.fetch(`${app_base_url}/schedule`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

	describe("Testing '/calendar'", () => {
		
		describe('GET /calendar', () => {
		
			it ('should return the user calendar', () => {
				return frisby
				.fetch(`${app_base_url}/calendar`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

	describe("Testing '/about'", () => {
		
		describe('GET /about', () => {
		
			it ('should return the about info', () => {
				return frisby
				.fetch(`${app_base_url}/about`)
				.then(data => {
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8');
			});
			
		});

	});

});