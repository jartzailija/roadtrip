
var ExternalDataHandler = require('./externalDataHandler.js');
const config = require('./config.js');

/**
 * This class calculates, when user will be in given coordinates and
 * gets forecasts for them
 */
class ForecastHandler extends ExternalDataHandler {

    constructor() {
        super();

        //Get needed API-keys from the config -file
        this.googleKey = config.googleKey;
        this.weatherKey = config.weatherKey;
    }

    /**********************************************************************
     * PUBLIC
     **********************************************************************/

    /**
     * Gets coordinates and time, returns coordinates and forecasts, which are
     * calculated with time estimates
     * @param  {Array<Object>} coords  An array of forecast point coords
     * @param  {Integer} departureTime Unixtimestamp in seconds, UTC
     * @return {Array<Object>} Array of forecast points containing weather forecasts
     */
    async getForecast(coords, departureTime) {
        let forecastCoords = [];

        //get time estimates, when user is in locations
        //Async operation, other code waits for it, until it is completed
        let timeCoords = await this.calculateTimes(coords, departureTime);
        var accumulatedTime = Number(departureTime);

        for(var singleTimeCoord of timeCoords) {

            //Calculate travelling time estimates to UTC unix-timestamp
            accumulatedTime += Number(singleTimeCoord.time);

            //Get and parse weather data from external source to single forecast point
            let url = config.forecastUrl + '?lat=' + singleTimeCoord.lat + '&lon=' + singleTimeCoord.lng + '&appid=' + this.weatherKey;
            let rawWeatherData = await this.getWeather(url);
            singleTimeCoord.weather = this.parseWeather(accumulatedTime, rawWeatherData);

            //The arriving time in the single point is not needed anymore
            delete singleTimeCoord['time'];
            forecastCoords.push(singleTimeCoord);
        }
        return forecastCoords;
    }

    /**********************************************************************
     * PRIVATE
     **********************************************************************/

    /**
     * Calculates travelling time estimates between coordinates
     * Uses Google Distance Matrix Web -service
     * @param  {Array<Object>}  coords   Array of coordinates
     * @param  {Integer}  departureTime Unixtimestamp
     * @return {Promise}               [description]
     */
    async calculateTimes(coords, departureTime) {
        var urlBegin = config.distanceServiceUrl;
        let timeCoords = [];
        //Stop calculations to the second last coords
        for(var i = 0; i < coords.length - 1; i++) {
            let url = urlBegin + '?origins='+ coords[i].lat + ','+ coords[i].lng + '&destinations='+ coords[i + 1].lat + ','+ coords[i + 1].lng + '&key=' + this.googleKey;

            //Await takes a time from Promise to as handable data
            let duration = await this.getTime(url);

            //Add the origin point and leaving time to array
            if(i === 0) {
                timeCoords.push({
                    lat: coords[i].lat,
                    lng: coords[i].lng,
                    time: Number(0)
                });
            }

            let tmpTimeCoords = {
                lat: coords[i + 1].lat,
                lng: coords[i + 1].lng,
                time: Number(duration)
            };
            timeCoords.push(tmpTimeCoords);
        }
        return timeCoords;


    }

    /**
     * Interface to the external service to get travelling time between coordinates
     * @param  {String}  url web service url with get parameters
     * @return {Promise}     Contains traveling time as seconds
     */
    async getTime(url) {
        return new Promise((resolve, reject) => {
            resolve(super.getExternalData(url, 'json'));
        })
        .then(data => {
            //Get the time as seconds
            //TODO: tsekkaa taulukot, onko niissä muuta dataa
            return data.rows[0].elements[0].duration.value;
        })
        .catch(error => {
            //TODO: ehkä joku uudelleenyritys
            console.log(error);
            reject(error);
        });
    }

    /**
     * Get weather data to single forecast point from external service
     * @param  {String}  url Service url with parameters
     * @return {Promise}     List of weather forecast to single coordinates
     */
    async getWeather(url) {
        return new Promise((resolve, reject) => {
            resolve(super.getExternalData(url, 'json'));
        })
        .then(data => {
            return data.list;
        })
        .catch(error => {
            //TODO: ehkä joku uudelleenyritys
            console.log(error);
            reject(error);
        });
    }

    /**
     * Parse the weather forecast to right form to sent to the front end
     * @param  {String} arrivalTime Unix time stamp in seconds (utc)
     * @param  {Array<Object>} weatherData Array of forecasts
     * @return {Object}             Collection of forecast informations
     */
    parseWeather(arrivalTime, weatherData) {
        let forecast = this.searchNearestForecast(arrivalTime, weatherData);
        let rain = 0;
        let wind = 0;

        //Check a value existence
        if(forecast.hasOwnProperty('wind') && forecast.wind.hasOwnProperty('speed')) {
            wind = forecast.wind.speed;
        }
        if(forecast.hasOwnProperty('rain') && forecast.rain.hasOwnProperty('3h')) {
            rain = Number(forecast.rain['3h']) / 3;
        }

        return {
            temperature: this.kelvinToCelcius(forecast.main.temp),
            main: forecast.weather[0].main,
            description: forecast.weather[0].description,
            weatherId: forecast.weather[0].id,
            wind: wind,
            rainPerHour: rain
        };
    }

    /**
     * Return the nearest forecast from forecast list compared to arrivaltime
     * to that location
     * @param  {[type]} arrivalTime [description]
     * @param  {[type]} weatherData [description]
     * @return {[type]}             [description]
     */
    searchNearestForecast(arrivalTime, weatherData) {
        //Find out, which forecast has the nearest time to the arrival time,
        //to location
        var nearestForecast = {
            index: 0,
            timeSeparation: 0
        };
        for(var i = 0; i < weatherData.length; i++) {
            let separation = Math.abs(weatherData[i].dt - arrivalTime);
            if(i === 0) {
                nearestForecast.timeSeparation = separation;
            }
            else {
                if(separation < nearestForecast.timeSeparation) {
                    nearestForecast.index = i;
                    nearestForecast.timeSeparation = separation;
                }
            }
        }

        return weatherData[nearestForecast.index];
    }

    /**
     * Guess this functionality :P
     * @param  {Integer} kelvin Kelvin
     * @return {Integer}        Celcius
     */
    kelvinToCelcius(kelvin) {
        return Math.round(Number(kelvin) - 273);
    }

}

//Return as an object
module.exports = function() {
    return new ForecastHandler();
};
