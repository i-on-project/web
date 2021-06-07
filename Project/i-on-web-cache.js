'use strict'

const data = require('./add-missing-data.js')();
const Cache = require('./cache.js');
const myCache = new Cache(60 * 60 * 24); /// 1 Day

/******* Helper function *******/
// TO DO - simplify
const getData = async function(key, fetchNewData) {
	const value = myCache.get(key);
	
	if (value) { /// If value was cached
		console.log("[Cache-ttl] - " + myCache.getTtl(key))
		
		if(myCache.getTtl(key) && myCache.getTtl(key) > value.metadata['lastModified']) { /// If ttl hasn't expired
			console.log("[Cache-Get] - the data was cached and ttl hasn't expired.. ")
			return Promise.resolve(value);
		} else { /// If ttl has expired
			console.log("[Cache-Get] - the data was cached and ttl has expired.. ")
			const dataToBeCached = await fetchNewData("test");//value.metadata['lastModified']
			myCache.set(key, dataToBeCached);
			return dataToBeCached;
		}

	} else { /// If value wasn't cached
		console.log("[Cache-Get] - the data wasnt cached.. ")
		const dataToBeCached = await fetchNewData();
		myCache.set(key, dataToBeCached);
		console.log("[Cache-ttl Else] - " + myCache.getTtl(key))
		return dataToBeCached;
	}

}

module.exports = function(data) {

	const loadAllProgrammes = async function() {
		console.log("\n[Cache] - Passing by... ");

		const programmes = await getData(
			"programmes", 
			data.loadAllProgrammes 
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmes));

		return programmes.data; // TO DO - remove .data
	};

	const loadAllProgrammeOffers = async function(programmeId) {
		console.log("\n[Cache] - Passing by... ");

		const programmeOffers = await getData(
			programmeId + "offers", 
			data.loadAllProgrammeOffers(programmeId) 
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmeOffers));

		return programmeOffers.data; // TO DO - remove .data
	};

	const loadProgrammeData = async function(programmeId) {
		console.log("\n[Cache] - Passing by... ");

		const programmeData = await getData(
			programmeId, 
			data.loadProgrammeData(programmeId) 
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmeData));

		return programmeData.data; // TO DO - remove .data
	};

	const loadCourseClassesByCalendarTerm = async function(courseId, calendarTerm) {
		console.log("\n[Cache] - Passing by... ");

		const programmeData = await getData(
			courseId + calendarTerm, 
			data.loadCourseClassesByCalendarTerm(programmeId, calendarTerm)  
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(programmeData));

		return programmeData.data; // TO DO - remove .data
	};

	const loadAboutData = async function() {
		console.log("\n[Cache] - Passing by... ");

		const aboutData = await getData(
			"about", 
			data.loadAboutData
		)

		console.log('\n[Cache] - stored in cache: ' + JSON.stringify(aboutData));

		return aboutData.data; // TO DO - remove .data
	};

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
		loadCourseEventCalendar : loadCourseEventCalendar,
		loadClassSchedule : loadClassSchedule
	};
}