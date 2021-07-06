'use strict'

const frisby = require('frisby');
const fetch = require('node-fetch');
//const setCookieParser = require('set-cookie-parser');
//const Joi = frisby.Joi;

const app_base_url = 'http://localhost:8080/'; // TO DO port and prefix generic
const db_base_url = process.env.DB_ELASTIC_URL;

//const storageCreator = require('../covida-db-elastic.js');
//const database = storageCreator('localhost', 9200);

//let cookie;

const cheerio = require('cheerio');

// TO DO - This is an early version of the integration tests - We're still experimenting

describe(`Integration tests on ${app_base_url}`, () => {
	/// Verificar se o servidor está a correr
	describe('Checking if server is running', () => {
		test ('the server must be running', () => {
			return frisby.get(`${app_base_url}/`)
		});
	});
});

describe("Testing '/'", () => {
	describe('GET /', () => {
		it ('should return the home page', () => {
			return frisby
				.fetch(`${app_base_url}/`)
				.then(data => {
					console.log('Test body -->' + data.body);
					const $ = cheerio.load(data.body);
					expect($("head [charset]").attr("charset")).toBe("utf-8");
				})
				.expect('status', 200)
				.expect('header', 'Content-Type', 'text/html; charset=utf-8')
		});
	});
});
