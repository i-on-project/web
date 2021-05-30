const NodeCache = require( "node-cache" );

class Cache {
    
    constructor(ttlSeconds) {
        //this.cache = new NodeCache({ stdTTL: ttlSeconds, useClones: false,  deleteOnExpire: false});
        this.cache = new NodeCache({ stdTTL: 60});
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

    set(key, value, ttl) {
        return this.cache.set(key, value, ttl);
    }

    del(keys) {
        this.cache.del(keys);
    }

    getTtl(key) {
        return this.cache.getTtl(key);
    }
/*
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

    }*/

}


module.exports = Cache