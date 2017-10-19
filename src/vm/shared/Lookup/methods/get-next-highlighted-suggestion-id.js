import required from 'utils/required-params';
import assert from 'utils/assert';

import Lookup from 'vm/shared/Lookup';

/**
 * Gets ID of next highlighted suggestion
 * 
 * @param {object} opts
 * @param {Lookup} opts.lookup
 * @param {bool}   opts.forward 
 * @return {number|null} ID of next highlighted suggesion
 */
export default function getNextHighlightedSuggestionId(opts) {
    const {lookup, forward} = required(opts);
    assert(lookup instanceof Lookup);

    if (!lookup.suggestions.length) {
        // skip since no suggestions
        return null;
    }

    const id = lookup.highlightedSuggestionId;
    const currentSuggestion = id && lookup.suggestions.find(s => s.id === id);

    if (!currentSuggestion) {
        if (forward) {
            return lookup.suggestions[0].id;
        }
    } else {
        const suggestionIdx = lookup.suggestions.indexOf(currentSuggestion);

        let nextIdx = suggestionIdx + (forward ? 1 : -1);

        // check boundaries
        nextIdx = Math.max(nextIdx, 0);
        nextIdx = Math.min(nextIdx, lookup.suggestions.length - 1);

        const nextSuggestion = lookup.suggestions[nextIdx];
        return nextSuggestion.id;
    }
}