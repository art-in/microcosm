import EventedViewModel from 'vm/utils/EventedViewModel';

import Popup from './Popup';
import Lookup from './Lookup';

/** */
export default class LookupPopup extends EventedViewModel {

    static eventTypes = [
        'change',
        'phrase-changed',
        'suggestion-selected'
    ];

    /**
     * Is shown?
     * @type {bool}
     */
    get active() {
        return this.popup && this.popup.active;
    }

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
     * Target entity to lookup for
     * @type {*}
     */
    target = null;

    /**
     * Constructor
     * @param {string} inputPlaceholder 
     */
    constructor(inputPlaceholder) {

        super();
        this.popup = new Popup();
        this.lookup = new Lookup(inputPlaceholder);

        this.retransmit(this.lookup, 'phrase-changed');
        this.retransmit(this.lookup, 'suggestion-selected');
    }

    /**
     * Activates popup
     * @param {object} opts
     */
    activate({pos, target}) {
        this.target = target;
        this.popup.activate(pos);

        this.lookup.clear();
        this.lookup.focus();
    }

    /**
     * Deactivates popup
     * @param {object} opts
     */
    deactivate() {
        this.popup.deactivate();
    }

    /**
     * Sets suggestions
     * @param {*} args 
     */
    setSuggestions(...args) {
        this.lookup.setSuggestions(...args);
    }

}