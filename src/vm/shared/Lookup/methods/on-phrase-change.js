import required from 'utils/required-params';
import assert from 'utils/assert';
import debounce from 'debounce';

import Lookup from 'vm/shared/Lookup';
import clearLookup from './clear-lookup';

/** 
 * Handles phrase change from lookup
 * 
 * @param {object}   opts
 * @param {string}   opts.phrase
 * @param {Lookup}   opts.lookup
 * @param {function} opts.onPhraseChangeAction
 * @return {object} lookup update object
*/
export default function onPhraseChange(opts) {
    const {phrase, lookup, onPhraseChangeAction} = required(opts);
    assert(lookup instanceof Lookup);

    let update = null;

    if (phrase) {
        const action = lookup.onPhraseChangeAction({phrase});
        callDebounced(onPhraseChangeAction, action);

        update = {
            phrase,
            loading: true
        };

    } else {
        update = clearLookup();
    }
    
    return update;
}

const callDebounced = debounce((func, arg) => func(arg), 500);