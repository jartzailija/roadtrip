/**
 * Responsible for the set time -input, and returns selected time as UTC.
 * Requires jQuery
 */

class ClockModule {

    /**************************************************************************
     * Set clock listener
     */
    constructor() {
        this.setClockListener();

        //Custom event for changing a leaving time
        this.timeSetEvent = new Event('timeSet');
        this.selectedTime = new Date().getTime() / 1000 | 0;;
    }

    /**********************************************************************
     * PUBLIC
     **********************************************************************/

    /*************************************************************************
     * @return {Integer} return selected time as an unix timestamp in  seconds
     */
    get time() {
        return this.selectedTime;
    }

    /***************************************************************************
     * @param  {Integer} time set selected time as an unix timestamp in seconds
     */
    set time(time) {
        this.selectedTime = time;
    }


    /**********************************************************************
     * PRIVATE
     **********************************************************************/


    /**************************************************************************
     * Set the jQuery-assisted listener for set time -input
     */
    setClockListener() {
        let thisObj = this;
        //jQuery -using listener for timepicker
        $(document).ready(function(){
            $('input.timepicker').timepicker({
                timeFormat: 'HH:mm',
                interval: 30,
                minTime: '0',
                defaultTime: '00:00',
                startTime: '00:00',
                dynamic: true,
                dropdown: true,
                scrollbar: true,
                change : function(time) {
                    thisObj.timeHandler(time);
                }
            });
        });

    }

    /**************************************************************************
     * If given time is ahead of current time - it will be today
     *      if it is before current time - it will be tomorrow
     * @param  {Integer} time unix time stamp in seconds (not bound to current date)
     */
    timeHandler(time) {
        let timeNow = new Date();
        let selectedTimeStamp = 0;

        let isTomorrowSelected = false;

        //Uses the Datejs -helper library

        let lastMidNight = Date.today();
        let nextMidNight = Date.today().add(1).days();

        let hoursNow = timeNow.getHours();
        let minutesNow = timeNow.getMinutes();

        let selectedHours = time.getHours();
        let selectedMinutes = time.getMinutes();

        //If a selected time has gone today,
        //assume that it is time at tomorrow
        if(selectedHours < hoursNow) {
            isTomorrowSelected = true;
        }
        else if(selectedHours == hoursNow &&
            selectedMinutes < minutesNow) {
                isTomorrowSelected = true;
        }

        //Convert selected time to timestamp as milliseconds
        if(isTomorrowSelected) {
            selectedTimeStamp = nextMidNight.addHours(selectedHours)
                .addMinutes(selectedMinutes);
        }
        else {
            selectedTimeStamp = lastMidNight.addHours(selectedHours)
                .addMinutes(selectedMinutes);
        }

        //Set seconds only to the time handler
        this.time = selectedTimeStamp / 1000;

        //Emit a custom TimeSet -event
        document.dispatchEvent(this.timeSetEvent);

    }

}
