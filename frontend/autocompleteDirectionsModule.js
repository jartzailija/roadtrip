/**
 * This module takes care of autocompleting the origin and the destination inputs.
 * It renders the route between them to the map. It also updates the route, if
 * the routeline on the map is dragged or the origin or the destionation is changed.
 *
 * Inspired by https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-directions
 */
class AutocompleteDirectionsModule{

    /**************************************************************************
     * Initializes Autocomplete-objects and sets listeners for them
     * @param  {Map} map   Google Maps - wrapped map dom object
     */
    constructor(map) {
        this.map = map;

        this.routeObj;

        var originInput = document.getElementById('origin');
        var destinationInput = document.getElementById('destination');
        this.travelMode = 'DRIVING';

        var originAutocomplete = new google.maps.places.Autocomplete(
           originInput, {
               placeIdOnly: true
           });

        var destinationAutocomplete = new google.maps.places.Autocomplete(
           destinationInput, {
               placeIdOnly: true
           });


        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            map: this.map,
            draggable: true
        });

        this.setDraggedListener();

        //Render the route
        this.route();

    }

    /**********************************************************************
     * PUBLIC
     **********************************************************************/

    /**************************************************************************
     * @return {DirectionsRenderer} return directionsrenderer obj
     */
    getDirectionsRendererObj() {
        return this.directionsDisplay;
    }

    /**************************************************************************
     * @return {DirectionsRoute} the route of this direction
     */
    getRoute() {
        return this.routeObj;
    }

    /**********************************************************************
     * PRIVATE
     **********************************************************************/

    /**************************************************************************
     * Sets a listener, which listens if user changes origin or destination coords
     * @param  {places.Autocomplete} autocomplete Autocomplete-object to be listened
     * @param  {String} mode         String to separate origin and destination objs
     */
    setupPlaceChangedListener(autocomplete, mode) {
        let thisObj = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
                window.alert("Valitse paikka tippuvalikosta.");
                return;
            }
            if (mode === 'ORIG') {
                thisObj.originPlaceId = place.place_id;
            }
            else {
                thisObj.destinationPlaceId = place.place_id;
            }
            thisObj.route();
        });
    }

    /**************************************************************************
     * Adds a listerner to listen route dragging. Updates the route when dragged.
     */
    setDraggedListener() {
        var thisObj = this;
        google.maps.event.addListener(thisObj.directionsDisplay,
            'directions_changed', function(e) {
                let dirs = thisObj.directionsDisplay.getDirections();
                thisObj.routeObj = dirs.routes[0];
            });
    }

    /**************************************************************************
     * API for route searching. Renders the route after searching
     */
    route() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        var thisObj = this;

        this.directionsService.route({
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            travelMode: this.travelMode
        },
        function(response, status) {
            if (status === 'OK') {
                thisObj.routeObj = response.routes[0];
                thisObj.directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Reitin haku epäonnistui, koska:  ' + status);
            }
        });
    }
}
