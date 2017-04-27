var ExternalDataHandler = require('./externalDataHandler.js');

/**
 * This class gets data from external source and caches it after
 * handling it with given function. Uses doublebuffer during the cache update
 */
class CacheDataHandler extends ExternalDataHandler {

    /**************************************************************
     * Set up member variables and update the cache at first time
     * @param  {String} cacheKey    Used to prevent name collisions
     * @param  {Function} parser    Callback to parse received data
     * @param  {String} url         Web service url to receive data
     * @param  {Integer} updateDelay Update deley to the cache in seconds
     */
    constructor(cacheKey, parser, url, updateDelay) {
        super();

        this.parser = parser;
        this.url = url;
        this.cacheKey = cacheKey;

        this.cacheUpdateDelay = updateDelay;

        this.nodeCacheClass = require("node-cache");
        this.cache = new this.nodeCacheClass();

        //Used as a "spare cache", when the original cache is under update
        this.frontBuffer = new this.nodeCacheClass();

        //When the cache has gone old, it will be updated
        this.cache.on( "del", ( key, value ) => {
            this.updateCache();
        });

        this.updateCache();

    }


    /**********************************************************************
     * PUBLIC
     **********************************************************************/

    /**************************************************************
     * Get data from the cache
     * @param  {String} key cache key
     * @return {Mixed}     received data from the cache
     */
    getCacheContent(key) {

        //different value for callback-return
        let retValue;
        this.cache.get(key, (err, value) => {
            if(err) {
                console.log(err);
            }
            else if(value === undefined) {

                //This happens only, when the "real" cache is deleted
                //and it is under update
                retValue = this.getSpareCacheContent(key);
            }
            else {
                retValue =  value;
            }
        });

        return retValue;
    }

    /**********************************************************************
     * PRIVATE
     **********************************************************************/

    /**************************************************************
     * Set data to cache and to it's copy
     * @param {Mixed} value cacheable data
     */
    setCache(value) {
        this.cache.set(this.cacheKey, value, this.cacheUpdateDelay);

        //Copy values to the spare cache
        this.frontBuffer.set(this.cacheKey, value, 0);
    }


    /**************************************************************
     * Get data from the backup -cache
     * @param  {String} key cache key
     * @return {Mixed}     received data from the cache
     */
    getSpareCacheContent(key) {
        let retValue;

        this.frontBuffer.get(key, (err, value) => {
            if(err) {
                console.log(err);
            }
            else if(value === undefined) {
                console.log('Cache key not found: ' + key);
            }
            else {
                retValue =  value;
            }
        });
        return retValue;
    }

    /**************************************************************
     * Asynchronous function to get data from the web service as a promise
     * @return {Promise} Received data from the web service
     */
    async getExternalData() {
        return new Promise((resolve, reject) => {
            resolve(super.getExternalData(this.url, 'json'));
        })
        .then(data => {
            return this.parser(data);
        })
        .catch(error => {
            console.log(error);
            reject(error);
        });
    }

    /**************************************************************
     * Wrapper for an automatic cache update from the web service
     */
    async updateCache() {
        let trafficData = await this.getExternalData();
        this.setCache(trafficData);
    }

}

//Return the module as a class
module.exports = CacheDataHandler
