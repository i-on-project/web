'use strict'

const degrees = require('./data/programmes');
const about = require('./data/i-on-team');

module.exports = function() {

	const loadAllProgrammes = async function() {
		try {
			return degrees;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		try {
			const path = './data/offers/' + programmeId;
			const offers = require(path);
			return offers;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadProgrammeData = async function(programmeId) {
		try {
			const path = './data/programmes/' + programmeId;
			const offers = require(path);
			return offers;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadAboutData = async function() {
		try {
			return about;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadAboutData : loadAboutData
	};
}
