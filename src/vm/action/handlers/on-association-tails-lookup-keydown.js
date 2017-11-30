import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import onKeyDown from 'vm/shared/Lookup/methods/on-keydown';

/**
 * Handles key down event on association tails lookup
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.key
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {key} = required(data);

    const lookup = graph.associationTailsLookup.lookup;

    return view('update-association-tails-lookup', {
        lookup: onKeyDown({
            lookup,
            key,
            onSuggestionSelect: ({suggestion}) => {
                const action = lookup.onSelectAction({suggestion});
                dispatch(action);
            }
        })
    });
}