/**
 * This module is responsible to render weather cameras to the map. It also takes
 * care showing a slide show from camera images and generating info windows for them.
 */
class CameraModule {

    /************************************************************************
     * @param  {Map} map   Google Maps - wrapped map dom object
     */
    constructor(map) {
        this.map = map;
        this.cameras = [];

        //used when autoclosing infowindows, if another is opened
        this.openedInfoWindows = [];
    }

    /**********************************************************************
     * PUBLIC
     **********************************************************************/

    /****************************************************************
     * Clears camera-markers from the map and from memory
     */
    removeCameras() {
        this.cameras.forEach(camera => {
            camera.setMap(null);
        });
        this.cameras = [];
    }

    /**************************************************************************
     * Calculates which cameras are near of the route and adds marker for them
     * @param {String} unhandledRoute encoded String presentation from the route
     */
    setWeatherCameras(unhandledRoute) {
        //copy of this object to use in callbacks
        var thisObj = this;
        //Convert a given route to Polyline, which could be
        //compared to other coordinates
        let route = new google.maps.Polyline({
            path: google.maps.geometry.encoding.decodePath(unhandledRoute)
        });

        //Get all of the camera-json from backend
        nanoajax.ajax({url:'/cameras'}, function (respCode, responseText) {

            //If http request is OK, and there is all of the camera data
            if(respCode === 200) {
                let cameraData = JSON.parse(responseText);

                thisObj.renderCameras(cameraData, route);
            }
        });
    }

    /**********************************************************************
     * PRIVATE
     **********************************************************************/

    /**************************************************************************
     * Generates infowindows for camera spots.
     * @param  {Object} cameraData  Parsed camera-data object got from backend
     * @param  {Integer} iterator   ID kind of camera separator
     * @return {InfoWindow}         A ready infowindow obj
     */
    generateInfoWindow(cameraData, iterator) {

        let idName = 'slider' + iterator;
        let imgTags = '<div class="slider" id="' + idName + '">';

        //If camera images exist, add them to a info window
        if(cameraData.hasOwnProperty('imgUrls') && cameraData.imgUrls.length > 0) {
            for(let imgData of cameraData.imgUrls){

                imgTags += `<figure class="image-holder"><img src="` + imgData + `" />
                    <p class="open-image-link"><a href="` + imgData + `" target="_blank">
                    Avaa kuva uudessa välilehdessä</a></p></figure>`;
            }
            imgTags += '</div>';
        }

        let content = '<div class="infowindow">' + imgTags + '</div>';
        let infoWindow = new google.maps.InfoWindow({
            content : content
        });

        //An image slider set-up for infowindow
        //Peppermint is an imageslider
        google.maps.event.addListener(infoWindow, 'domready', function() {
            var slider = Peppermint(document.getElementById(idName),
            config.sliderOptions);
        });

        return infoWindow;
    }
    /**
     * [renderCameras description]
     * @param  {Array<Object>} cameraData Array of unhandled cameradata from backend
     * @param  {Polyline} route      Route, where cameras have to be to set
     */
    renderCameras(cameraData, route) {
        //iterator is used as id -attribute
        let camIterator = 0;
        var thisObj = this;

        for(let iterCamObj of cameraData) {

            try {
                var camPosition = new google.maps.LatLng(iterCamObj.lat,
                    iterCamObj.lng);
            }
            catch(e) {
                console.log('Error while calculating camera location');
                console.log(e);
                continue;
            }

            //If a camera is near the route, add it to the map
            if (google.maps.geometry.poly.isLocationOnEdge(camPosition, route,
                config.locationOnEdgeTolerance)) {

                let infoWindow = thisObj.generateInfoWindow(iterCamObj, camIterator);
                let marker = new google.maps.Marker({
                    position: camPosition,
                    icon: config.cameraIconPath
                });

                //Open the infowindow when a marker is clicked
                marker.addListener('click', function() {
                    thisObj.closeOpenInfoWindows();
                    infoWindow.open(thisObj.map, marker);
                    thisObj.openedInfoWindows.push(infoWindow);
                });
                marker.setMap(thisObj.map);

                thisObj.cameras.push(marker);
                camIterator++;
            }
        }
    }

    /**************************************************************************
     * Close all open infowindows
     */
    closeOpenInfoWindows() {
        this.openedInfoWindows.forEach(window => {
            window.close();
        });
    }
}
