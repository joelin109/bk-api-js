const Config = require('../Config');
const redis = require('redis');

// cookie
const cookieRedisClient = redis.createClient({host: Config.redis.host, port: Config.redis.port, db: 0});

// 应用缓存
const commonRedisClient = redis.createClient({host: Config.redis.host, port: Config.redis.port, db: 1});

// 超时发布
const expirePublishClient = redis.createClient({host: Config.redis.host, port: Config.redis.port, db: 2});

// 超时订阅
const expireSubscribeClient = redis.createClient({host: Config.redis.host, port: Config.redis.port, db: 2});
expireSubscribeClient.psubscribe('__keyevent@2__:expired');

let clients = [cookieRedisClient, commonRedisClient, expirePublishClient, expireSubscribeClient];

let CacheUtil = {

    loadCache: function () {
        //SystemConfigWebFinalLogic.loadCache();
    },

    /**
     * redis set
     * @param index,默认为 0:session，1:cache, 2:订单
     * @param key
     * @param value
     * @param expire_time
     * @returns {Promise}
     */
    set: (key, value, index = 0, expire_time) => {
        return new Promise((resolve, reject) => {
            if (!key) return reject(new Error('cache:set:key_is_null'));
            value = JSON.stringify(value);
            let client = clients[index];
            if (expire_time) {
                client.set(key, value, 'EX', expire_time, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            } else {
                client.set(key, value, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            }
        });
    },

    get: (key, index = 0) => {
        return new Promise((resolve, reject) => {
            if (!key) return reject(new Error('cache:get:key_is_null'));
            let client = clients[index];
            client.get(key, (err, result) => {
                if (err) return reject(err);
                let res;
                try {
                    res = JSON.parse(result);
                } catch (err) {
                    res = result;
                }
                resolve(res);
            });
        });
    },

    remove: (key, index = 0) => {
        return new Promise((resolve, reject) => {
            if (!key) return reject(new Error('cache:remove:key_is_null'));
            let client = clients[index];
            client.del(key, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    expire: (key, index = 0, exp = Config.cookie.max_age) => {
        return new Promise((resolve, reject) => {
            if (!key) return reject(new Error('cache:expire:key_is_null'));
            let client = clients[index];
            client.expire(key, exp, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    onExpired: (index = 0, callback) => {
        let client = clients[index];
        client.on('pmessage', (pattern, channel, expiredKey) => {
            console.log('key [' + expiredKey + '] has expired');
            callback(expiredKey);
        });
    }
};

module.exports = CacheUtil;

module.exports.cookieCache = {
    namespace: 'cookie:',
    set: async (key, value, exp = Config.cookie.max_age) => {
        await CacheUtil.set(this.namespace + key, value, 0, exp);
    },
    get: async key => {
        return await CacheUtil.get(this.namespace + key, 0);
    },
    remove: async key => {
        await CacheUtil.remove(this.namespace + key, 0);
    },
    refresh: async key => {
        await CacheUtil.expire(this.namespace + key, 0, Config.cookie.max_age);
    }
};

module.exports.commonCache = {
    set: async (key, value, exp) => {
        await CacheUtil.set(key, value, 1, exp);
    },
    get: async key => {
        return await CacheUtil.get(key, 1);
    },
    remove: async key => {
        await CacheUtil.remove(key, 1);
    }
};

module.exports.expireCache = {
    onExpired: callback => {
        CacheUtil.onExpired(3, callback);
    }
};

module.exports.orderCache = {
    set: async (key, value, exp = Config.redis.order_time_expire) => {
        await CacheUtil.set(key, value, 2, exp);
    },
    get: async key => {
        return await CacheUtil.get(key, 2);
    },
    remove: async key => {
        await CacheUtil.remove(key, 2);
    }
};