const NodeCache = require( "node-cache" );

class Cache {
    
    constructor(ttlSeconds) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, useClones: false, deleteOnExpire: false});
    }

    hasExpired(key) {
        return ( Date.now() - this.cache.getTtl(key) ) > 0;
    }

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