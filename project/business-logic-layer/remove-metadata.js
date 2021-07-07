'use strict'

module.exports = function(data) {

    const loadAllProgrammes = async function () {
		return data.loadAllProgrammes();
	};

    return {
		loadAllProgrammes : loadAllProgrammes
	};

}
