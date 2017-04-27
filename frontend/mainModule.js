/**
 * This class coordinates all Google Maps -based classes and initializes
 * Google Maps. Take care of setting the route
 *
 */
class MainModule{

    /*********************************************************************************
    * Init submodules
     */
    constructor() {
        this.map;
        this.weatherModule;
        this.cameraModule;
        this.clockModule;
        this.directionsModule;
    }

    /**********************************************************************
     * PUBLIC
     **********************************************************************/


    /**********************************************************************************
     * Maps -loading script calls this while initializes Maps -object
     */
    initMap() {
        //For callbacks
        var thisObj = this;

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: config.center,
            scrollwheel: true,
            zoom: config.zoomLvl
        });

        //This object takes care of the autocomplete and the direction rendering
        this.directionsModule = new AutocompleteDirectionsModule(this.map);
        this.cameraModule = new CameraModule(this.map);
        this.clockModule = new ClockModule();
        this.weatherModule = new WeatherModule(this.map);

        google.maps.event.addListener(thisObj.directionsModule.getDirectionsRendererObj(),
        'directions_changed', function(e) {
            thisObj.updateAdditionalRouteData(false);
        });

        document.addEventListener('timeSet', function(e) {
            try {
                thisObj.updateAdditionalRouteData(false);
            }
            catch(e) {
                //Clock-jQuery might call during initialization
            }
        });
    }

    /************************************************************************
     * Adds cameras and warnings to the map
     * @param  {Boolean} toggleTestData If true, toggle test warning data
     */
    updateAdditionalRouteData(toggleTestData) {
        this.clearOldData();
        var polyViewRoute = this.directionsModule.getRoute().overview_polyline;
        this.cameraModule.setWeatherCameras(polyViewRoute);
        if(toggleTestData) {
            this.weatherModule.toggleTestWarnings();
        }
        this.setWarnings();
    }

    /**********************************************************************
     * PRIVATE
     **********************************************************************/

    /**************************************************************************
     * Set the weather warnings to the map
     */
    setWarnings() {
        this.weatherModule.setRoute(this.directionsModule.getRoute());
        this.weatherModule.getForecast(this.clockModule.time);
    }

    /*************************************************************************
     * Wipe out the warning and the camera data
     */
    clearOldData() {
        this.weatherModule.removeWarnings();
        this.cameraModule.removeCameras();
    }
}
