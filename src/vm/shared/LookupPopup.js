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
     * Gets action after suggestion selected
     * @type {function}
     */
    onSelectAction = undefined;

    /**
     * Gets action after phrase changed
     * @type {function}
     */
    onPhraseChangeAction = undefined;

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

}