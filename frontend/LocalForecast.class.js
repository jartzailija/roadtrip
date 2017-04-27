/**
 * A wrapper class to make coordinate handling easier.
 */
class LocalForecast {

    /**
     *
     * @param  {Object} jsObj a single weatherobject from backend
     */
    constructor(jsObj) {

        //Convert coords to latlng form
        this.latlng = new google.maps.LatLng({
            lat: jsObj['lat'],
            lng: jsObj['lng']
        });
        this.weather = jsObj.weather;
    }

    get lat() {
        return this.latlng.lat();
    }

    get lng() {
        return this.latlng.lng();
    }

    getLatLng() {
        return this.latlng;
    }


}
