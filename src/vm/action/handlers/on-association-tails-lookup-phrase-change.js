import required from 'utils/required-params';
import view from 'vm/utils/view-patch';

import onPhraseChange from 'vm/shared/Lookup/methods/on-phrase-change';

/**
 * Handles phrase change event on association tails lookup
 * 
 * @param {object} state
 * @param {object} data
 * @param {string} data.phrase
 * @param {function} dispatch
 * @return {Patch}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {phrase} = required(data);

    const lookup = graph.associationTailsLookup.lookup;

    return view('update-association-tails-lookup', {
        lookup: onPhraseChange({
            lookup,
            phrase,
            onPhraseChangeAction: action => dispatch(action)
        })
    });
}