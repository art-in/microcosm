import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import LookupSuggestionType from 'vm/shared/LookupSuggestion';

/**
 * Handles suggestion select event from idea search lookup
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
    const {suggestion} = required(data);

    const ideaId = suggestion.data.ideaId;

    dispatch({
        type: 'open-idea-form-modal',
        data: {ideaId}
    });

    dispatch({
        type: 'animate-mindmap-viewbox-to-idea',
        data: {ideaId}
    });

    // deactivate search box
    return view('update-idea-search-box', {
        active: false
    });
}