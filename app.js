const express = require('express');
const path = require('path');
var Base64 = require('js-base64').Base64;

var forecastHandler = (new require('./backend/forecastHandler.js'))();
var cameraApi = (new require('./backend/cameraApi.js'))();

var app = express();


app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'frontend/index.html');
});

//Request to get traffic data and traffic camera images
app.get('/cameras', (req, res) => {
    let locData = cameraApi.getData();
    res.send(locData);
});

//Request to get data for weather forecast
app.get('/weatherforecast/:timestamp/:coords', async (req, res) => {

    //A timestamp in seconds to get right forecast time
    let depTime = req.params.timestamp;

    //Parse base64 -encoded js-objects
    let forecastCoords = JSON.parse(Base64.decode(req.params.coords));
    let forecastWithCoords = await forecastHandler.getForecast(forecastCoords, depTime);
    res.send(forecastWithCoords);
});

app.listen(80, () => {
    console.log("It's alive!");
});
