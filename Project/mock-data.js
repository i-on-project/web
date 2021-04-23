'use strict'

const programmes = require('./data/programmes');
const about = require('./data/i-on-team');

module.exports = function() {

	const loadAllProgrammes = async function() {
		try {
			return programmes;
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
			const programme = require(path);
			return programme;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadCourseByID = async function(courseId) {
		try {
			const path = './data/courses/' + courseId;
			const course = require(path);
			return course;
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
		loadCourseByID : loadCourseByID,
		loadAboutData : loadAboutData
	};
}
