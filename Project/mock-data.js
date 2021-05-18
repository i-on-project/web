'use strict'

const programmes = require('./data/programmes');
const about = require('./data/i-on-team');

// Test simulating a user (to delete)
const user = {
	username: "user",
	password: "123",
	selectedCoursesAndClasses: {} /// {"1": ["1D", "1N", ..], "2": []}
};

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

	// Test functions (to delete)
	const loadUser = async function() {
		try {
			return user;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

/// {"1": ["1D", "1N", ..], "2": []}
	const saveUserCoursesAndClasses = async function(body) {
		try { 
			// avoid: substitution and repetition
			for (const prop in body) { /// Iterate over body properties (chooen courses)
				if (body.hasOwnProperty(prop) ) { 

					if(!user.selectedCoursesAndClasses.hasOwnProperty(prop)) { /// If the user has not yet chosen that course 
						user.selectedCoursesAndClasses[prop] = body[prop];
					} else { /// If the user has already chosen classes from that course, then it will be added to the array (we filter classes first to avoid repetitions)
						const newClasses = body[prop]
						.filter(
							courseClass => !user.selectedCoursesAndClasses[prop].includes(courseClass)
						);
						user.selectedCoursesAndClasses[prop] = user.selectedCoursesAndClasses[prop].concat(newClasses);
					} 
			
				}
			}
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseByID : loadCourseByID,
		loadAboutData : loadAboutData,
		loadUser : loadUser,
		saveUserCoursesAndClasses : saveUserCoursesAndClasses
	};
}
