import LookupType from 'vm/shared/Lookup';

/**
 * Gets ID of next highlighted suggestion
 *
 * @param {object} opts
 * @param {LookupType} opts.lookup
 * @param {boolean}   opts.forward
 * @return {string|null} ID of next highlighted suggestion
 */
export default function getNextHighlightedSuggestionId(opts) {
  const {lookup, forward} = opts;

  if (!lookup.suggestions.length) {
    // skip since no suggestions
    return null;
  }

  const id = lookup.highlightedSuggestionId;
  const currentSuggestion = id && lookup.suggestions.find(s => s.id === id);

  if (!currentSuggestion) {
    // select first
    return lookup.suggestions[0].id;
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
