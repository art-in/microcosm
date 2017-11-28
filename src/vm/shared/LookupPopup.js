import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

import Popup from './Popup';
import Lookup from './Lookup';

/**
 * Lookup popup
 */
export default class LookupPopup extends ViewModel {

    /**
     * Popup container
     * @type {Popup}
     */
    popup = undefined;

    /**
     * Lookup
     * @type {Lookup}
     */
    lookup = undefined;

    /**
     * Is shown?
     * @type {boolean}
     */
    get active() {
        return this.popup && this.popup.active;
    }

    /**
     * Constructor
     * @param {string} placeholder - input placeholder 
     */
    constructor(placeholder) {
        super();
        
        this.popup = new Popup();
        this.lookup = new Lookup({placeholder});

        return initInstance(this);
    }

}