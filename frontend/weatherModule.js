/**
 * Module calculates forecast points, and when driver is in them for the route.
 * Then it gets forecasts for those points from the backend. It renders warning
 * colors if there is bad driving weather, when driver has arrived to forecast point.
 *
 * Because normally the weather is almost always good to drive, there are some testing functions
 * implemented to this module.
 */
class WeatherModule {

    /**********************************************************************************
     * @param  {Map} map   Google Maps - wrapped map dom object
     */
    constructor(map) {

        this.map = map;

        //Google Maps -datatype conversions from given route
        //*****************************************************


        //Full route as DirectionsRoute
        this.route;
        //Full route as an array of LatLngs
        this.LatLngArr;

        //Full route as an array of Polyline
        this.polylineRoute;

        //Array containing LocalForecasts
        this.forecastData;

        //Array of the colored warningPolylines
        this.readyPolyLines = [];

        //List of weathertypes, which affect to driving conditions
        this.weatherTypes = weatherTypes;

        //weathertypes extended with test cases
        this.testWeatherTypes = weatherTypes.concat(testWeatherTypes);

        //Used to indicate, is testweathertypes used to render warnings
        this.useTestData = false;

        //This is responsible for showing loading image
        this.loadingIndicator = new LoadingIndicator();
    }

    /**********************************************************************************
     * PUBLIC
     *********************************************************************************/

    /**********************************************************************************
     * Set the route and calculate alternative Maps datatype presentations for it
     * @param  {DirectionsRoute} route The route, which need forecasts
     */
    setRoute(route) {
        this.route = route;
        this.LatLngArr = this.convertToLatLngArr(route);
        this.polylineRoute = new google.maps.Polyline({
            path: this.LatLngArr
        });
    }

    /**********************************************************************************
     * Wrapper for Ajax-getter, handles a route and passes it
     * forward
     * @param  {Integer} departureTime Unix -timestamp (UTC) when leaving from the origin
     */
    getForecast(departureTime) {
        let coords = [];
        let coord2 = [];

        //Add an origin point to coordinates
        coords.push(this.polylineRoute.GetPointAtDistance(0));

        //Get coordinates after every x meters
        //Using v3_epoly -helper library
        coord2 = coords.concat(this.polylineRoute.GetPointsAtDistance(config.forecastPointDistance));

        //set forecast as member
        this.getForecastByAjax(coord2, departureTime);
    }

    /**********************************************************************************
     * Draw warnings of bad weather to the map based on object members
     */
    setWeatherWarnings() {
        for(var i = 0; i < this.forecastData.length; i++) {
            let begin = this.forecastData[i];

            //When weatherpoints end, draw a possible warning to
            //end of route
            if(i !== this.forecastData.length - 1){
                var end = this.forecastData[i + 1];
            }

            else {
                var tmpLatLng = this.LatLngArr[this.LatLngArr.length - 1];
                var end = new LocalForecast({
                    lat: tmpLatLng.lat(),
                    lng: tmpLatLng.lng(),
                    weather: {}
                });
            }

            let color = this.getWarningSeverity(begin);

            let polyline = this.getPolylineBetweenPoints(begin, end, color);
            this.readyPolyLines.push(polyline);
            polyline.setMap(this.map);
        }
    }


    /****************************************************************
     * Clears warnings from the map and removes them from memory
     */
    removeWarnings() {
        this.readyPolyLines.forEach(polyLine => {
            polyLine.setMap(null);
        });
        this.readyPolyLines = [];
    }

    /******************************************************************
     * Used when re-rendering the map. Changes between "normal" and
     * test weathertypes
     * @return {[type]} [description]
     */
    toggleTestWarnings() {

        //if warnings are already drawn to the map
        if(this.useTestData) {
            this.weatherTypes = weatherTypes;
            this.useTestData = false;
        }
        //Use them to be drawn to the map
        else {
            this.weatherTypes = this.testWeatherTypes;
            this.useTestData = true;
        }
    }


    /**********************************************************************************
     * PRIVATE
     *********************************************************************************/


    /**********************************************************************************
     * Helper to convert the JSON-typed forecast to JS-object and
     * coordinates to maps LatLng -type
     * @param  {String} jsonData [description]
     * @return {Array<ForecastObject>}          Array of the forecast objects
     */
    convertForecastData(jsonData) {
        let unhandledData = JSON.parse(jsonData);
        return unhandledData.map(forecastObj => {
            return new LocalForecast(forecastObj);
        });
    }


    /**********************************************************************************
     * Get the forecast from backend and set it as a member
     * @param  {Array<LatLng>} coordsArray   Array of forecast points
     * @param  {Integer} departureTime Unix -timestamp when leaving from the origin
     */
    getForecastByAjax(coordsArray, departureTime) {
        let gMap = this.map;
        let weatherData;
        let codedCoords = Base64.encodeURI(JSON.stringify(coordsArray));
        var thisObj = this;

        //Send a weatherforecast request to the backend. Coordinates are base64 -encoded
        //to prevent character/whitespace encoding -based corruption
        nanoajax.ajax({url: '/weatherforecast/' + departureTime + '/' + codedCoords,

            //Render a loading icon
            onprogress: thisObj.loadingIndicator.setLoadingIcon()
            },
            function (respCode, responseText) {
                if(respCode === 200) {
                    thisObj.forecastData = thisObj.convertForecastData(responseText);
                    //This is called inside callback, because all major browsers
                    //don't support async/await -properties
                    thisObj.setWeatherWarnings();
                    thisObj.loadingIndicator.clearLoader();
                }
                else {
                    thisObj.loadingIndicator.setErrorIcon();
                    console.log('An error while getting weather data.');
                }
            });
    }

    /**********************************************************************************
     * Get graphical route -object between given points
     * @param  {LocalForecast} point1         [description]
     * @param  {LocalForecast} point2         [description]
     * @param  {String} color          [description]
     * @return {Polyline}                [description]
     */
    getPolylineBetweenPoints(point1, point2, color) {
        let beginIndex = this.getNearestLatLngIndex(point1);
        let endIndex = this.getNearestLatLngIndex(point2);

        //split a correct LatLng-array from the LatLngArr
        let latLngArray = this.LatLngArr.slice(Number(beginIndex), Number(endIndex) + 1);

        let polyline = new google.maps.Polyline({
            path: latLngArray,
            strokeColor: color,
            zIndex: 100
        });

        return polyline;
    }

    /**********************************************************************************
     * Calculate, where are the nearest coordinates in the array compared
     * to the given comparsion value (forecastPoint)
     * @param  {LocalForecast} forecastPoint          [description]
     * @param  {Array<LatLng>} pathPointArray [description]
     * @return {Number}                [description]
     */
    getNearestLatLngIndex(forecastPoint) {
        var comparsionObject = {
            index: 0,
            distance: 0
        };

        for(var pointIndex in this.LatLngArr) {
            let distance = google.maps.geometry.spherical
                .computeDistanceBetween(forecastPoint.getLatLng(), this.LatLngArr[pointIndex]);

            //Init the comparsion value
            if(Number(pointIndex) === 0) {
                comparsionObject.distance = distance;
            }

            //Find, which point is the nearest to comparsion location
            else {
                if(distance < comparsionObject.distance) {
                    comparsionObject.index = pointIndex;
                    comparsionObject.distance = distance;
                }
            }
        }

        return Number(comparsionObject.index);
    }


    /**********************************************************************************
     * Calculate warning severity for bad weather and return a severity color code
     * @param  {LocalForecast} forecast
     * @param  {Array<Obj>} pWeatherTypes optional array of weathertypes to use here
     * @return {String}          Warning color as HTML-code
     */
    getWarningSeverity(forecast, pWeatherTypes) {

        let weatherTypes = pWeatherTypes;

        if(pWeatherTypes === undefined) {
            weatherTypes = this.weatherTypes;
        }

        let severity = 0;

        //Check, if there are already defined warnings for
        //forecasted weather type
        weatherTypes.forEach(typeObj => {
            if(Number(forecast.weather.weatherId) === Number(typeObj.id)) {
                severity = Number(typeObj.severity);
            }

        });

        //Compare rain and wind limits to severity approximations
        for(var key in config.rainLimits) {
            if(Number(forecast.weather.rainPerHour) > Number(config.rainLimits[key])) {
                if(Number(key) > severity) {
                    severity = Number(key);
                }
            }
        }

        for(var key in config.windLimits) {
            if(Number(forecast.weather.wind) > Number(config.windLimits[key])) {
                if(Number(key) > severity) {
                    severity = Number(key);
                }
            }
        }
        return config.severityColors['' + severity];
    }


    /**********************************************************************************
     * Convert a route from directionsService to array of LatLng-coords
     * @param  {DirectionsRoute} route A route for processing
     * @return {Array<LatLng>} Array of calculates coords
     */
    convertToLatLngArr(route) {
        return google.maps.geometry.encoding.decodePath(route.overview_polyline);
    }


}
