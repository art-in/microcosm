import debounce from 'debounce';

import LookupType from 'vm/shared/Lookup';

import clearLookup from './clear-lookup';

/**
 * Handles phrase change event from lookup
 *
 * @param {object}     opts
 * @param {string}     opts.phrase
 * @param {LookupType} opts.lookup
 * @param {function}   opts.onPhraseChangeAction
 * @return {Partial<LookupType>} update object
 */
export default function onPhraseChange(opts) {
  const {phrase, lookup, onPhraseChangeAction} = opts;

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
