import assert from 'utils/assert';

import EventedViewModel from 'vm/utils/EventedViewModel';
import Point from 'vm/shared/Point';

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
    onSelectAction = null;

    /**
     * Gets action after phrase changed
     * @type {function}
     */
    onPhraseChangeAction = null;

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
    activate({pos, onSelectAction, onPhraseChangeAction}) {
        assert(pos instanceof Point);
        assert(onSelectAction);
        assert(onPhraseChangeAction);

        this.onSelectAction = onSelectAction;
        this.onPhraseChangeAction = onPhraseChangeAction;
        this.popup.activate({pos});

        this.lookup.clear();
        this.lookup.focus();
    }

    /**
     * Deactivates popup
     */
    deactivate() {
        this.popup.deactivate();
    }

    /**
     * Sets suggestions
     * @param {array.<LookupSuggestion>} suggestions 
     */
    setSuggestions(suggestions) {
        this.lookup.setSuggestions(suggestions);
    }

}