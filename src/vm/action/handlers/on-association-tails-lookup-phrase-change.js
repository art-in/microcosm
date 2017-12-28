import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import onPhraseChange from 'vm/shared/Lookup/methods/on-phrase-change';

/**
 * Handles phrase change event on association tails lookup
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.phrase
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset: {mindmap}}}} = state;
    const {phrase} = required(data);

    const lookup = mindmap.associationTailsLookup.lookup;

    return view('update-association-tails-lookup', {
        lookup: onPhraseChange({
            lookup,
            phrase,
            onPhraseChangeAction: action => dispatch(action)
        })
    });
}