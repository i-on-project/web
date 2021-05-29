const NodeCache = require( "node-cache" );

class Cache {
    
    constructor(ttlSeconds) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    /**
     * Check if a key is cached.
     * @param {*} key cache key to check.
     * @returns boolean indicating if the key is cached.
     */
    has(key) {
        return this.cache.has(key);
    }

    /**
     * Get the value of the specified key. If a value is cached then it shall be returned. 
     * Else, get a new value from the fetchNewData function, and set a new value in the cache service.
     * @param {*} key cache key to check.
     * @param {*} fetchNewData function to fetch data if it isn't cached
     * @param {*} ttl time to live in seconds to cache data if it isn't cached
     * @returns a promise of the value stored in the key 
     */
    async get(key, fetchNewData, ttl) {

        const value = this.cache.get(key);
        if (value) {
            console.log("[Cache-Get] - the data was cached.. ")
            return Promise.resolve(value);
        }

        console.log("[Cache-Get] - the data wasnt cached.. ")
        const dataToBeCached = await fetchNewData();
        this.cache.set(key, dataToBeCached, ttl);
        return dataToBeCached;

    }

    set(key, value) {
        return this.cache.set(key, value);
    }

    del(keys) {
        this.cache.del(keys);
    }

    delStartWith(startStr = '') {

        if (!startStr) {
            return;
        }

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
            this.del(key);
            }
        }

    }

}


module.exports = Cache