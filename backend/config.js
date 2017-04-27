module.exports = {

    //Url for the weather camera service -json
    cameraApiUrl: 'https://tie.digitraffic.fi/api/v1/metadata/camera-stations?lastUpdated=false',

    //as seconds
    cameraCacheUpdateDelay: 3600,

    //url for the google distancematrix -service
    distanceServiceUrl: 'https://maps.googleapis.com/maps/api/distancematrix/json',

    //Server key for google-maps services
    googleKey: 'APIKEY_HERE',

    //API key for openweathermap.org
    weatherKey: 'APIKEY_HERE',

    //Url for openweathermap forecast requests
    forecastUrl: 'http://api.openweathermap.org/data/2.5/forecast'
};
