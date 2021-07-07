'use strict'

module.exports = function(data) {

    const loadAllProgrammes = async function () {
		console.log('metadata')
		const receivedData = await data.loadAllProgrammes();
		return receivedData.data;
	};

    return {
		loadAllProgrammes : loadAllProgrammes
	};

}
