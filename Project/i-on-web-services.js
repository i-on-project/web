'use strict'

module.exports = function(data) {

	const getHomeContent = async function(){
		
		const programmes = await getAllProgrammes();
		
		console.log("Programmes: " + JSON.stringify(programmes));

		// TO DO -> Simplify (do an auxiliar function)
		const bachelorProgrammes = programmes.entities.filter( entities => entities.properties.degree == "bachelor")
		.map(entities => entities.properties);
		
		const masterProgrammes = programmes.entities.filter( entities => entities.properties.degree == "master")
		.map(entities => entities.properties);

		return {bachelor: bachelorProgrammes, master: masterProgrammes, page: 'home'};
	};

	const getSchedule = async function(){
		return {page: "schedule"};
	};

	const getCalendar = async function(){
		return {page: "calendar"};
	};

	const getMyCourses = async function(){
		return {page: "myCourses"};
	};

	const getProgrammeOffers = async function(){
		const offers = await data.loadAllProgrammeOffers(1); // TO DO - Change

		const programmeOffers = offers.entities.map(entities => entities.properties);

		const programmeOffersByTerms = programmeOffers.reduce(function(offersByTerms, offer) {
			offersByTerms[offer.termNumber + 'º Semestre'] = offersByTerms[offer.termNumber + 'º Semestre'] || [];
			offersByTerms[offer.termNumber + 'º Semestre'].push(offer);
			return offersByTerms;
		}, {});

		return {programmeOffersByTerms : programmeOffersByTerms , page: "programmeOffers"};
	};

	const getProgrammeData = async function(id){
		// TO DO -> Simplify (do an auxiliar function)
		const programmes = await getAllProgrammes();
		const programme = programmes.entities.filter( entities => entities.properties.programmeId == id);

		return programme[0].properties;
	};

	const getAllProgrammes = async function(){
		return await data.loadAllProgrammes();
	};

	const getAboutData = async function(){
		return await data.loadAboutData();
	};

	return {
		getHomeContent : getHomeContent,
		getSchedule : getSchedule,
		getCalendar : getCalendar,
		getMyCourses : getMyCourses,
		getProgrammeOffers : getProgrammeOffers,
		getProgrammeData : getProgrammeData,
		getAboutData : getAboutData
	};
	
}



