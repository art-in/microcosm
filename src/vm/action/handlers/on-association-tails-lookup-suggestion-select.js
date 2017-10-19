import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

/**
 * Handles suggestion select event of association tails lookup
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.headIdeaId
 * @param {string} data.tailIdeaId
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {suggestion} = required(data);
    
    const lookup = graph.associationTailsLookup.lookup;

    const action = lookup.onSelectAction({suggestion});
    dispatch(action);

    // hide popup
    return view('update-association-tails-lookup', {
        popup: {active: false}
    });
}