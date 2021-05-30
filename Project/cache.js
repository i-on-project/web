const NodeCache = require( "node-cache" );

class Cache {
    
    constructor(ttlSeconds) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, useClones: false, deleteOnExpire: false});
    }

    /**
     * Check if a key is cached.
     * @param {*} key cache key to check.
     * @returns boolean indicating if the key is cached.
     */
    has(key) {
        return this.cache.has(key);
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value) {
        return this.cache.set(key, value);
    }

    del(keys) {
        this.cache.del(keys);
    }

    getTtl(key) {
        return this.cache.getTtl(key);
    }

}


module.exports = Cache