import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import searchIdeas from 'action/utils/search-ideas';

import LookupSuggestion from 'vm/shared/LookupSuggestion';
import setSuggestions from 'vm/shared/Lookup/methods/set-suggestions';

/**
 * Searches and sets suggesting ideas to idea search box lookup
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.phrase
 * @return {PatchType}
 */
export default function(state, data) {
    const {model: {mindset}} = state;
    const {phrase} = required(data);

    const ideas = searchIdeas(mindset, {phrase});

    // map to suggestions
    // TODO: move to separate mapper 'idea-to-suggestion'
    const suggestions = ideas
        .map(i => new LookupSuggestion({
            displayName: i.title,
            data: {ideaId: i.id}
        }));

    return view('update-idea-search-box', {
        lookup: setSuggestions(suggestions)
    });
}