import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import LookupSuggestionType from 'vm/shared/LookupSuggestion';

/**
 * Handles suggestion select event from idea search box
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.headIdeaId
 * @param {string} data.tailIdeaId
 * @param {LookupSuggestionType} data.suggestion
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {suggestion} = required(data);
    
    const lookup = graph.ideaSearchBox.lookup;

    const action = lookup.onSelectAction({suggestion});
    dispatch(action);

    // de-activate search box
    return view('update-idea-search-box', {
        active: false
    });
}