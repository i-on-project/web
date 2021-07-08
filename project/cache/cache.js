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

    set(key, value, ttl) {
        return this.cache.set(key, value, ttl);
    }

    getTtl(key) {
        return this.cache.getTtl(key);
    }

    ttl(key, ttl) {
        return this.cache.ttl(key, ttl);
    }

    del(key) {
        return this.cache.del(key);
    }
}


module.exports = Cache