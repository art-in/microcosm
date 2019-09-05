import LookupType from 'vm/shared/Lookup';

import clearLookup from './clear-lookup';
import getNextSuggestionId from './get-next-highlighted-suggestion-id';

/**
 * Handles keydown event from lookup
 *
 * @param {object} opts
 * @param {LookupType} opts.lookup
 * @param {string} opts.code
 * @param {function({suggestion})} opts.onSuggestionSelect
 * @param {function} opts.preventDefault
 * @return {Partial<LookupType>} update object
 */
export default function onKeyDown(opts) {
  const {code, lookup, preventDefault, onSuggestionSelect} = opts;

  let update = {};

  switch (code) {
    case 'ArrowUp':
    case 'ArrowDown': {
      // highlight next suggestion in the list
      const forward = code === 'ArrowDown';
      const suggestionId = getNextSuggestionId({lookup, forward});
      update = {
        highlightedSuggestionId: suggestionId
      };

      // prevent default browser behavior of moving caret in input
      preventDefault();
      break;
    }

    case 'Enter': {
      const {highlightedSuggestionId} = lookup;
      if (highlightedSuggestionId) {
        // select suggestion
        const suggestion = lookup.suggestions.find(
          s => s.id === highlightedSuggestionId
        );

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
