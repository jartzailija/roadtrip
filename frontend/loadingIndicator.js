/**
 * Little helper for the ajax loading indication and showing possible errors.
 */

class LoadingIndicator {

    /**
     * Set a default structure for the loader element
     */
    constructor() {
        this.loadIcon = config.loadingIconPath;
        this.errorIcon = config.loadingErrorIconPath;

        this.indicatorElement = document.getElementById('loader');
        this.setDefaultStructure();

        this.imgElement = document.getElementById('loaderImage');
        this.textElement = document.getElementById('loaderText');
    }

    /**********************************************************************
     * PUBLIC
     **********************************************************************/

    /**
     * Using with AJAX
     */
    setLoadingIcon() {
        this.setImage(config.loadingIconPath);
        this.setText('Ladataan ja lasketaan säätietoja ja kelivaroituksia.');
    }

    /**
     * Used if an error happens
     */
    setErrorIcon() {
        this.setImage(config.loadingErrorIconPath);
        this.setText('Virhe! Yritä uudestaan.');
    }

    /**
     * Remove a loader content
     */
    clearLoader() {
        this.clearText();
        this.clearImage();
    }

    /**********************************************************************
     * PRIVATE
     **********************************************************************/

     /**
      * Generates an image and a text node as HTML
      */
    setDefaultStructure() {
        this.indicatorElement.innerHTML = `
            <div id="loaderText"></div>
            <div id="loaderImage"></div>`;
    }

    setText(text) {
        this.clearText();
        let textNode = document.createTextNode(text);
        this.textElement.appendChild(textNode);
    }

    setImage(imgPath) {
        this.clearImage();
        let imgNode = document.createElement('img');
        imgNode.setAttribute('src', imgPath);
        this.imgElement.appendChild(imgNode);
    }

    clearText() {
        while (this.textElement.firstChild) {
            this.textElement.removeChild(this.textElement.firstChild);
        }
    }

    clearImage() {
        while (this.imgElement.firstChild) {
            this.imgElement.removeChild(this.imgElement.firstChild);
        }
    }


}
