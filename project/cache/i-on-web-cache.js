'use strict'

module.exports = function(data, myCache) {

	const loadAllProgrammes = async function() {

		const key = "programmes";

		const fetchFunction = function() { /// TO DO test if this really works
			return data.loadAllProgrammes(...arguments);
		}

		return getData(myCache, key, fetchFunction, default_ttl);

	};

	return {
        loadAllProgrammes : loadAllProgrammes,
	};
}


/******* Helper functions *******/

const getData = async function(myCache, key, fetchNewData, ttl) {
	
	let value = myCache.get(key);

	if(!value) {										/// Value does not exists

		console.log("\n[Cache] - Value does not exists")
		console.log("key: " + key + "function: " + fetchNewData + "ttl: " + ttl);
		value = await fetchNewData();
		console.log("After");
		myCache.set(key, value);

	} else if (myCache.hasExpired(key)) {				/// Value already exists but expired -> conditional request

		console.log("\n[Cache] - Value already exists but expired -> conditional request")
		
		console.log("--> " + value.metadata.ETag)
		const resp = await fetchNewData.apply(this, [value.metadata.ETag]);

		if(resp) {	/// The resource has been modified since the given date
			value = resp;
			myCache.set(key, value);
		} else {	/// The resource has not been modified since the given date, reset ttl to the initial value
			myCache.ttl(key, ttl);
		}

	} else {
		console.log("\n[Cache] - Value exists")
	}

	//console.log('\n[Cache] - stored in cache: ' + JSON.stringify(value));
	return value;

}