import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

import LookupSuggestionType from 'vm/shared/LookupSuggestion';

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
     * @type {Array.<LookupSuggestionType>}
     */
    suggestions = [];

    /**
     * Id of suggestion highlighed
     * in the list of suggestions
     * @type {string|undefined}
     */
    highlightedSuggestionId = undefined;

    /**
     * Indicates that lookup is loading suggestions
     * @type {boolean}
     */
    loading = false;

    /**
     * Indicates that lookup input field is focused
     * @type {boolean}
     */
    focused = false;

    /**
     * Input placeholder
     * @type {string|undefined}
     */
    placeholder = undefined;

    /**
     * Indicates 'nothing found' label is shown
     * @type {boolean}
     */
    nothingFoundLabelShown = false;

    /**
     * Gets action after phrase changed
     * @type {function|undefined}
     */
    onPhraseChangeAction = undefined;

    /**
     * Gets action after suggestion selected
     * @type {function({suggestion})|undefined}
     */
    onSelectAction = undefined;

    /**
     * Constructor
     * @param {Partial<Lookup>} [props]
     */
    constructor(props) {
        super();
        initProps(this, props);
    }

}