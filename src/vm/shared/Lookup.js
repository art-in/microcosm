import assert from 'utils/assert';

import EventedViewModel from 'vm/utils/EventedViewModel';
import LookupSuggestion from './LookupSuggestion';

import debounce from 'debounce';

/** */
export default class Lookup extends EventedViewModel {

    static eventTypes = [

        'change',

        'phrase-changed',

        'suggestion-selected'
    ];

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
    highlightedSuggestionId = null;

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
     * Indicates that lookup is rendered
     * @type {bool}
     */
    rendered = false;

    /**
     * Input placeholder
     * @type {string}
     */
    placeholder = undefined;

    nothingFoundLabelShown = false;

    /**
     * Constructor
     * @param {string} inputPlaceholder 
     */
    constructor(inputPlaceholder) {
        super();

        this.placeholder = inputPlaceholder;

        this.onPhraseChangeDebounced =
            debounce(this.onPhraseChangeDebounced, 500);
    }

    /**
     * Handles phrase change event
     * @param {string} phrase 
     */
    onPhraseChange(phrase) {
        this.phrase = phrase;
        this.loading = true;
        this.emit('change');

        this.onPhraseChangeDebounced(phrase);
    }

    /**
     * Debounced extension of onPhraseChange
     * @param {string} phrase 
     */
    onPhraseChangeDebounced(phrase) {
        if (phrase) {
            this.emit('phrase-changed', {phrase});
        } else {
            this.clearSuggestions();
        }
    }

    /**
     * Handles suggestion selected event
     * @param {number} suggestionId 
     */
    onSuggestionSelected(suggestionId) {

        const suggestion = this.suggestions.find(s => s.id === suggestionId);
        this.emit('suggestion-selected', {suggestion});

        this.clear();
        this.emit('change');
    }

    /**
     * Handles input focus lost event
     */
    onBlur() {
        this.focused = false;
    }

    /**
     * Handles show event
     */
    onShown() {
        this.shown = true;
    }

    /**
     * Handles render event
     */
    onHidden() {
        this.shown = false;
    }

    /**
     * Handles key press event
     * @param {string} keyCode
     */
    onKeyPress(keyCode) {

        switch (keyCode) {
        case 'ArrowDown':
            this.highlightNextSuggestion(true);
            break;
        case 'ArrowUp':
            this.highlightNextSuggestion(false);
            break;
        case 'Enter':
            if (this.highlightedSuggestionId) {
                this.onSuggestionSelected(this.highlightedSuggestionId);
            }
            break;
        default:
            // skip
        }
    }

    /**
     * Highlights next suggestion
     * @param {bool} forward 
     */
    highlightNextSuggestion(forward) {

        if (!this.suggestions.length) {
            // skip since no suggestions
        }

        const id = this.highlightedSuggestionId;
        const currentSuggestion = id && this.suggestions.find(s => s.id === id);

        if (!currentSuggestion) {
            if (forward) {
                this.highlightedSuggestionId = this.suggestions[0].id;
                this.emit('change');
            }
        } else {
            const suggestionIdx = this.suggestions.indexOf(currentSuggestion);

            let nextIdx = suggestionIdx + (forward ? 1 : -1);

            // check boundaries
            nextIdx = Math.max(nextIdx, 0);
            nextIdx = Math.min(nextIdx, this.suggestions.length - 1);

            const newSuggestion = this.suggestions[nextIdx];
            this.highlightedSuggestionId = newSuggestion.id;
            this.emit('change');
        }
    }

    /**
     * Sets suggestions
     * @param {array.<Suggestion>} suggestions 
     */
    setSuggestions(suggestions) {
        assert(suggestions.every(s => s instanceof LookupSuggestion));

        this.suggestions = suggestions;
        
        this.highlightedSuggestionId = null;
        this.loading = false;

        this.nothingFoundLabelShown = !suggestions.length;
        
        this.emit('change');
    }

    /**
     * Focus lookup input
     */
    focus() {
        this.focused = true;

        if (this.shown) {
            this.emit('change');
        }
    }

    /**
     * Clears lookup input
     */
    clear() {
        this.phrase = '';
        this.clearSuggestions();
    }

    /**
     * Clears suggestion list
     */
    clearSuggestions() {
        this.suggestions = [];
        this.activeSuggesionId = null;
        this.nothingFoundLabelShown = false;
        
        if (this.shown) {
            this.emit('change');
        }
    }

}