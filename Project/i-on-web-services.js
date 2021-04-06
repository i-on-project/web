'use strict'

module.exports = function(storage, core_data) {

	const getHomeContent = async function(){
		const programmes = await getAllProgrammes();
		return {bachelor: programmes['bachelor'], master: programmes['master'], page: 'home'};
	};

	const getScheduleContent = async function(){
		return {page: "schedule"};
	};

	const getCalendarContent = async function(){
		return {page: "calendar"};
	};

	const getAllProgrammes = async function(){
		return await storage.loadAllProgrammes();
	};

	return {
		getHomeContent : getHomeContent,
		getScheduleContent : getScheduleContent,
		getCalendarContent : getCalendarContent,
		getAllProgrammes : getAllProgrammes
	};
}



