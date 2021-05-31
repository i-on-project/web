'use strict'

const data = require('./add-missing-data.js')();
const Cache = require('./cache.js');

const default_ttl = 30;
const myCache = new Cache(default_ttl); /// 1 Day

/******* Helper function *******/
const getData = async function(key, fetchNewData, ttl) {
	
	let value = myCache.get(key);

	if(!value) {										/// Value does not exists
		console.log("\n[Cache] - Value does not exists")
		console.log("key: " + key + "function: " + fetchNewData + "ttl: " + ttl);
		value = await fetchNewData();
		console.log("After");
		myCache.set(key, value);

	} else if (myCache.hasExpired(key)) {				/// Value already exists but expired -> conditional request
		console.log("\n[Cache] - Value already exists but expired -> conditional request")
		
		console.log("--> " + value.metadata.lastModified)
		const resp = await fetchNewData.apply(this, [value.metadata.lastModified]);

		if(resp) {	/// The resource has been modified since the given date
			value = resp;
			myCache.set(key, value);
		} else {	/// The resource has not been modified since the given date, reset ttl to the initial value
			myCache.ttl(key, ttl);
		}

	} else {console.log("\n[Cache] - Value exists")}

	//console.log('\n[Cache] - stored in cache: ' + JSON.stringify(value));
	return value;

}

module.exports = function() {

	const loadAllProgrammes = async function() {

		const key = "programmes";

		const fetchFunction = function() {
			return data.loadAllProgrammes(7, ...arguments);
		}

		return getData(key, fetchFunction, default_ttl);

	};

	const loadAllProgrammeOffers = async function(programmeId) {
		return data.loadAllProgrammeOffers(programmeId) 
	};

	const loadProgrammeData = async function(programmeId) {
		return data.loadProgrammeData(programmeId);
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm)  {
		return data.loadCourseClassesByCalendarTerm(courseId, calendarTerm);
	}

	const loadAboutData = async function () {
		return await data.loadAboutData();
	};

	const loadAuthenticationTypes = function () {
		return data.loadAuthenticationTypes();
	};

	const loadAuthenticationMethodFeatures = function () {
		return data.loadAuthenticationMethodFeatures();
	};

	const submitInstitutionalEmail = function(email) {
		return data.submitInstitutionalEmail(email);
	};

	const pollingCore = function(authForPoll) {
		return data.pollingCore(authForPoll);
	};


	// TO DO:
	const loadCourseEventCalendar = async function(courseId, semester) {

	};
	
	const loadClassSchedule = async function(courseId, classId, semester) {

	};
	
	return {
        loadAllProgrammes : loadAllProgrammes,
		loadAllProgrammeOffers : loadAllProgrammeOffers,
		loadProgrammeData : loadProgrammeData,
		loadCourseClassesByCalendarTerm : loadCourseClassesByCalendarTerm,
		loadAboutData : loadAboutData,
		loadAuthenticationTypes : loadAuthenticationTypes,
		loadAuthenticationMethodFeatures : loadAuthenticationMethodFeatures,
		submitInstitutionalEmail : submitInstitutionalEmail,
		pollingCore : pollingCore,
		loadCourseEventCalendar : loadCourseEventCalendar,
		loadClassSchedule : loadClassSchedule
	};
}