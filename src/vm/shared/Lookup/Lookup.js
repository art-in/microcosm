import initInstance from 'utils/init-instance';

import ViewModel from 'vm/utils/ViewModel';

/**
 * Lookup
 */
export default class Lookup extends ViewModel {

    /**
     * Search phrase
     * @type {string}
     */
    phrase = '';

    /**
     * Suggestions list
     * @type {array.<LookupSuggestion>}
     */
    suggestions = [];

    /**
     * Id of suggestion highlighed
     * in the list of suggestions
     * @type {string}
     */
    highlightedSuggestionId = undefined;

    /**
     * Indicates that lookup is loading suggestions
     * @type {bool}
     */
    loading = false;

    /**
     * Indicates that lookup input field is focused
     * @type {bool}
     */
    focused = false;

    /**
     * Input placeholder
     * @type {string}
     */
    placeholder = undefined;

    /**
     * Indicates 'nothing found' label is shown
     * @type {boolean}
     */
    nothingFoundLabelShown = false;

    /**
     * Gets action after phrase changed
     * @type {function}
     */
    onPhraseChangeAction = undefined;

    /**
     * Gets action after suggestion selected
     * @type {function}
     */
    onSelectAction = undefined;

    /**
     * Constructor
     * @param {object} [props]
     */
    constructor(props) {
        super();
        return initInstance(this, props);
    }

}