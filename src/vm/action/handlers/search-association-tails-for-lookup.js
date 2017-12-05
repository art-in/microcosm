import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import searchIdeas from 'action/utils/search-ideas';
import getIdea from 'action/utils/get-idea';

import LookupSuggestion from 'vm/shared/LookupSuggestion';
import setSuggestions from 'vm/shared/Lookup/methods/set-suggestions';

/**
 * Searches and sets suggesting ideas to lookup
 * which selects tail idea for cross-association
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.phrase 
 * @param {string} data.headIdeaId 
 * @return {PatchType}
 */
export default function searchAssociationTailsForLookup(state, data) {
    const {model: {mindmap}} = state;
    const {phrase, headIdeaId} = required(data);

    const headIdea = getIdea(mindmap, headIdeaId);

    const excludeIds = [];
    
    // exclude head
    excludeIds.push(headIdeaId);

    // exclude child ideas
    const childIds = headIdea.edgesOut.map(a => a.to.id);
    excludeIds.push(...childIds);

    // exclude parent ideas
    const parentIds = headIdea.edgesIn.map(a => a.from.id);
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
        lookup: setSuggestions(suggestions)
    });
}