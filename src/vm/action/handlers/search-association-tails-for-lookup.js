import required from 'utils/required-params';
import view from 'vm/utils/patch-view';

import searchIdeas from 'action/utils/search-ideas';
import getIdea from 'action/utils/get-idea';

import LookupSuggestion from 'vm/shared/LookupSuggestion';

/**
 * Searches and sets suggesting ideas to lookup
 * which selects tail idea for cross-association
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.phrase 
 * @param {string} data.headIdeaId 
 * @return {Patch}
 */
export default function searchAssociationTailsForLookup(state, data) {
    const {model: {mindmap}} = state;
    const {phrase, headIdeaId} = required(data);

    const headIdea = getIdea(mindmap, headIdeaId);

    const excludeIds = [];
    
    // exclude head
    excludeIds.push(headIdeaId);

    // exclude child ideas
    const childIds = headIdea.associationsOut.map(a => a.to.id);
    excludeIds.push(...childIds);

    // exclude parent ideas
    const parentIds = headIdea.associationsIn.map(a => a.from.id);
    excludeIds.push(...parentIds);

    // exclude root idea
    excludeIds.push(mindmap.root.id);

    const ideas = searchIdeas(mindmap, {phrase, excludeIds});

    // map to suggestions
    const suggestions = ideas
        .map(i => new LookupSuggestion({
            displayName: i.value,
            data: {ideaId: i.id}
        }));

    return view('update-association-tails-lookup', {
        lookup: {
            suggestions,
            highlightedSuggestionId: null,
            loading: false,
            nothingFoundLabelShown: !suggestions.length
        }
    });
}