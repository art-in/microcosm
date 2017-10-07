import required from 'utils/required-params';

/**
 * Applies 'set-suggestions-to-association-tails-lookup' mutation
 * 
 * @param {object}                   state
 * @param {object}                   data
 * @param {array.<LookupSuggestion>} data.suggestions
 */
export default function setSuggestionsToAssociationTailsLookup(
    state, data) {
    const {graph} = state.vm.main.mindmap;
    const {suggestions} = required(data);

    graph.associationTailsLookup.setSuggestions(suggestions);
}