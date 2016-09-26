class $cache {
    constructor({name, active, storageMode, lifetime, Cache}) {
        this.name = name;
        this.active = active;
        this.lifetime = lifetime;
        this.lastCacheTime = {};
        this.cacher = Cache.get(name) || Cache.createCache(name, {storageMode: storageMode || 'localStorage'});
        this._headerPostfix = '.headers';
    }

    _isValid(key) {
        let now = new Date().getTime();
        return !this.lifetime || (this.lastCacheTime[key] + this.lifetime) > now;
    }

    isActive() {
        return !!this.active;
    }

    enable(active) {
        this.active = active;
    }

    setLifetime(time) {
        this.lifetime = time;
    }

    clear() {
        this.cacher.removeAll();
    }

    get(key) {
        return this._isValid(key) ? this.cacher.get(key) : null;
    }

    headers(key) {
        return this._isValid(key) ? this.cacher.get(key + this._headerPostfix) : null;
    }

    put(key, response, headers) {
        this.cacher.put(key, response);
        this.cacher.put(key + this._headerPostfix, headers);
        this.lastCacheTime[key] = new Date().getTime();
    }
}

export default $cache;