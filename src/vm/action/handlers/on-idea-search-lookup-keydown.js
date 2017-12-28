import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import onKeyDown from 'vm/shared/Lookup/methods/on-keydown';

/**
 * Handles keydown event from idea search box
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.code
 * @param {function} data.preventDefault
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset}}} = state;
    const {code, preventDefault} = required(data);

    const lookup = mindset.ideaSearchBox.lookup;

    return view('update-idea-search-box', {
        lookup: onKeyDown({
            lookup,
            code,
            preventDefault,
            
            // TODO: is it necessary to set this on each keydown?
            onSuggestionSelect: ({suggestion}) => {
                dispatch({
                    type: 'on-idea-search-lookup-suggestion-select',
                    data: {suggestion}
                });
            }
        })
    });
}