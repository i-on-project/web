'use strict'

const error = require('./i-on-web-errors.js');

const getAllProgrammes = async function(data){
	return await data.loadAllProgrammes();
};

const getProgrammesByDegree = async function(data){
	
	const programmes = await getAllProgrammes(data);
	// TO DO -> Simplify (do an auxiliar function)

	const bachelorProgrammes = programmes.entities
	.filter( entities => entities.properties.degree == "bachelor")
	.map(entities => entities.properties);

	const masterProgrammes = programmes.entities
	.filter( entities => entities.properties.degree == "master")
	.map(entities => entities.properties);

	return {bachelor: bachelorProgrammes, master: masterProgrammes};
};

const response = async function(data, obj) {
	const programmes = await getProgrammesByDegree(data);

	obj['bachelor'] = programmes.bachelor;
	obj['master'] = programmes.master;

	return obj;
}


module.exports = function(data) {

	const getHomeContent = async function(){
		return await response(data, {page: 'home'});
	};

	const getSchedule = async function(){
		return await response(data, {page: "schedule"});
	};

	const getCalendar = async function(){
		return await response(data, {page: "calendar"});
	};

	const getMyCourses = async function(){
		return await response(data, {page: "myCourses"});
	};

	const getClasses = async function(body) {

		const coursesIDs = Object.values(body)
		.map(courseId => parseInt(courseId))
		.filter(courseId => courseId != 0); // TO DO - Change

		// TO DO - Simplify the following code
		const courses = [];
		for(let i = 0; i < coursesIDs.length; i++)
			courses.push(await data.loadCourseByID(coursesIDs[i]));

		const classesByCourses = courses.reduce((response, course) => {
			
			const result = course.entities
			.map(entities => entities.properties)
			.reduce( (course_classes, course_class) => {
				course_classes.classes.push(course_class.id);
				course_classes.name = course_class.name;
				return course_classes;
			}, {name: '', classes: []});
			response.push(result)
			return response;
		}, []);

		return await response(data, {selectedCourses : classesByCourses});
		
	};

	const getProgrammeOffers = async function(programmeId){
		const offers = await data.loadAllProgrammeOffers(programmeId);

		const programmeOffersByTerms = offers.entities
		.map(entities => entities.properties)
		.reduce( (offersByTerms, offer) => {
			return offer.termNumber.reduce( (offersByTerms, term) => {
				offersByTerms[term] = offersByTerms[term] || [];
				offersByTerms[term].push(offer);
				return offersByTerms;
			}, offersByTerms);

		}, {});

		return await response(data, {programmeOffersByTerms : programmeOffersByTerms , page: "programmeOffers"});
	};

	const getProgrammeData = async function(programmeId){
		const programme = await data.loadProgrammeData(programmeId);
		const offers = await getProgrammeOffers(programmeId);

		return await response(data, {programmeOffersByTerms: offers.programmeOffersByTerms, programme: programme.properties});
	};

	const getAboutData = async function(){
		const aboutData = await data.loadAboutData();
		aboutData.projects.map(project => project['image'] = project.name + '.png');
		
		return await response(data, {
			projects: aboutData.projects, 
			teachers: aboutData.teachers,
			department: aboutData.department,
			departmentImage: aboutData.department + '.png'
		});
	};

	return {
		getHomeContent : getHomeContent,
		getSchedule : getSchedule,
		getCalendar : getCalendar,
		getMyCourses : getMyCourses,
		getClasses : getClasses,
		getProgrammeOffers : getProgrammeOffers,
		getProgrammeData : getProgrammeData,
		getAboutData : getAboutData
	};
	
}
