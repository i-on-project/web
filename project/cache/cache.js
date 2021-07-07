const NodeCache = require( "node-cache" );

class Cache {
    
    constructor(ttlSeconds) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, useClones: false, deleteOnExpire: false});
    }
    
    get(key) {
        return this.cache.get(key);
    }

    hasExpired(key) {
        console.log(`now: ${Date.now()} ttl: ${this.cache.getTtl(key)}`)
        return ( Date.now() - this.cache.getTtl(key) ) > 0;
    }

    set(key, value) {
        return this.cache.set(key, value);
    }

    getTtl(key) {
        return this.cache.getTtl(key);
    }

    ttl(key, ttl) {
        return this.cache.ttl(key, ttl);
    }

}


module.exports = Cache