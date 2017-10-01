import LookupSuggestion from 'vm/shared/LookupSuggestion';

/**
 * Applies 'set-association-tails-to-lookup' mutation
 * @param {object} state
 * @param {object}       mutation
 * @param {array.<Idea>} mutation.ideas
 * @param {string}       mutation.targetLookup
 */
export default function setAssociationTailsToLookup(state, mutation) {
    const graph = state.vm.main.mindmap.graph;
    const {ideas} = mutation.data;

    const suggestions = ideas
        .map(i => new LookupSuggestion(i.id, i.value));

    graph.associationTailsLookup.setSuggestions(suggestions);
}