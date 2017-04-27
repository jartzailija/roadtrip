var CacheDataHandler = require('./cacheDataHandler.js');
var config = require('./config.js');


/**********************************************************************
 * An interface for the camera & other traffic data. Used to parse traffic data.
 */
class CameraApi {
    constructor() {
        this.camUrl = config.cameraApiUrl;
        this.camKey = 'cameraData';

        this.cacheDataHandler = new CacheDataHandler(this.camKey,
            this.parseData, this.camUrl, config.cameraCacheUpdateDelay);
    }

    /**********************************************************************
     * Return cached data from traffic camera stations
     * @return {Array<Object>} [description]
     */
    getData() {
        return this.cacheDataHandler.getCacheContent(this.camKey);
    }

    /******************************************************************************
     * Parse wanted properties to the frontend. This method is used as a callback
     * in the CacheDataHandler object
     * @param  {Object} rawCamData unhandled data from traffic stations
     * @return {Array<Object>}            parsed data as JS-objects
     */
    parseData(rawCamData) {
        var camData;
        camData = rawCamData.features.map(obj => {
            try {
                return {
                        id: obj.properties.roadStationId,
                        lat: obj.geometry.coordinates[1],
                        lng: obj.geometry.coordinates[0],
                        imgUrls: obj.properties.presets.map(camObj => {
                            return camObj.imageUrl;
                        })
                    }
                }
            catch(e) {
                return {
                    id: null,
                    lat: null,
                    lng: null,
                    imgUrls: []
                }
            }
        });
        return camData;
    }


}
//Return as an object
module.exports = function() {
    return new CameraApi();
};
