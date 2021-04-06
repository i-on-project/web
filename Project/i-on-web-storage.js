'use strict'

const degrees = require('./data/programmes');

module.exports = function() {

	const loadAllProgrammes = async function() {
		try {
			return degrees;
		} catch (err) {
			// TO DO - Handle errors
		}
	};

	return {
        loadAllProgrammes : loadAllProgrammes
	};
}
