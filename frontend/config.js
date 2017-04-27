/**
 * Global gonfiguration for different type of actions in the front end.
 */
var config = {

    //The center point of map
    center: {lat: 64.2168758, lng: 27.6938985}, //kajaani

    //The default zoom level on the map
    zoomLvl: 5,

    //Camera icon path:
    cameraIconPath: 'icons/weatherCamera.png',

    //Tolerance between a weathercamera and the route as degrees
    locationOnEdgeTolerance: 0.005, //About 5 km

    //Options for camera image sliders
    //Docs: https://github.com/wilddeer/Peppermint#settings
    sliderOptions: {
        dots: false,
        slideshow: true,
        speed: 500,
        slideshowInterval: 2000,
        stopSlideshowAfterInteraction: false,
        disableIfOneSlide: true,
    },

    //Distance between forecast points as meters
    forecastPointDistance: 30000,


    //These severity values are very approximated.
    //A key number represents severity value, which is triggered
    //after rain/wind value exceeds key's value
    //http://ilmatieteenlaitos.fi/sade
    //http://ilmatieteenlaitos.fi/tuulet
    rainLimits: {
        '2': 7.0,
        '3': 20.0
    },
    windLimits: {
        '2': 14,
        '3': 20
    },

    //0 = OK to drive
    //3 = Catastrophe
    severityColors: {
        '0': '#008DFF', //Blue
        '1': '#00D200', //Green
        '2': '#FFFF00', //Yellow
        '3': '#FF0000'  //Red
    },

    loadingIconPath: 'icons/gears.gif',
    loadingErrorIconPath: 'icons/error.png',
};
