import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import LookupSuggestionType from 'vm/shared/LookupSuggestion';

/**
 * Handles suggestion select event of association tails lookup
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {LookupSuggestionType} data.suggestion
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset: {graph}}}} = state;
    const {suggestion} = required(data);
    
    const lookup = graph.associationTailsLookup.lookup;

    const action = lookup.onSelectAction({suggestion});
    dispatch(action);

    // hide popup
    return view('update-association-tails-lookup', {
        popup: {active: false}
    });
}