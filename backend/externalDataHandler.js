/**
 * Sends GET-requestes to wanted web services. Uses popsicle-library, which uses
 * promises to handle asyncronic functionality
 */
class ExternalDataHandler {

    constructor() {
        //This is meant to be just an abstract class
        if (new.target === ExternalDataHandler) {
            throw new TypeError("Cannot construct ExternalDataHandler instances directly");
        }

        //A promise-based HTTP-library for external requests
        this.popsicle = require('popsicle');
    }

    /**
     * Asyncronic method to get data with GET -request. Returns a result body
     * @param  {String}  url             URL for REST:GET-request
     * @param  {Array<String>}  preParseOptions JSON and URLencoded are possible values
     * @return {Promise}                 Preparsed result body in a promise
     */
    async getExternalData (url, preParseOptions) {
        return await this.popsicle.get(url)
            .use(this.popsicle.plugins.parse(preParseOptions))
            .then(res => {
                if(res.status !== 200) {
                    throw new Error('Error while loading data from: ' + url);
                }
                else {
                    return res.body;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

}
//Return as a class
module.exports = ExternalDataHandler
