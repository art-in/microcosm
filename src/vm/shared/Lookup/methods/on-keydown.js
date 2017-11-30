import LookupType from 'vm/shared/Lookup';

import clearLookup from './clear-lookup';
import getNextSuggestionId from './get-next-highlighted-suggestion-id';

/**
 * Creates update for lookup keydown event
 * 
 * @param {object}   opts
 * @param {LookupType}   opts.lookup
 * @param {string}   opts.key
 * @param {function} opts.onSuggestionSelect
 * @return {object} lookup update object
 */
export default function onKeyDown(opts) {
    const {key, lookup, onSuggestionSelect} = opts;

    let update = {};

    switch (key) {
        
    case 'ArrowUp':
    case 'ArrowDown': {

        // highlight next suggestion
        const forward = key === 'ArrowDown';
        const suggestionId = getNextSuggestionId({lookup, forward});
        update = {
            highlightedSuggestionId: suggestionId
        };
        break;
    }

    case 'Enter': {
        const {highlightedSuggestionId} = lookup;
        if (highlightedSuggestionId) {

            // select suggestion
            const suggestion = lookup.suggestions
                .find(s => s.id === highlightedSuggestionId);
            
            onSuggestionSelect({suggestion});

            // clear lookup
            update = clearLookup();
        }
        break;
    }
    default:
        // skip
    }

    return update;
}