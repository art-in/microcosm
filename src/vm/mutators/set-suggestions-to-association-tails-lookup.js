import assert from 'assert';

import LookupSuggestion from 'vm/shared/LookupSuggestion';

/**
 * Applies 'set-suggestions-to-association-tails-lookup' mutation
 * 
 * @param {object}                   state
 * @param {object}                   mutation
 * @param {array.<LookupSuggestion>} mutation.data.suggestions
 */
export default function setSuggestionsToAssociationTailsLookup(
    state, mutation) {
    
    const graph = state.vm.main.mindmap.graph;
    const {suggestions} = mutation.data;

    assert(suggestions.every(s => s instanceof LookupSuggestion));

    graph.associationTailsLookup.setSuggestions(suggestions);
}