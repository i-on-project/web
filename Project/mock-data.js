'use strict'

module.exports = function() {

	const loadAllProgrammes = async function() {
		try {
			const programmes = await require('./data/programmes');
			return programmes;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		try {
			const path = './data/offers/' + programmeId;
			const programmeOffers = await require(path);
			return programmeOffers;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadProgrammeData = async function(programmeId) {
		try {
			const path = './data/programmes/' + programmeId;
			const programmeData = await require(path);
			return programmeData;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadCourse = async function(courseId) {
		try {
			const path = './data/courses/' + courseId;
			const course = await require(path);
			return course;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	const loadAboutData = async function() {
		try {
			const aboutData = await require('./data/i-on-team');
			return aboutData;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourse : loadCourse,
		loadAboutData : loadAboutData
	};
}
