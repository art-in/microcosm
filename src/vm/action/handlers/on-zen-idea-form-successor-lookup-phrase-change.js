import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import onPhraseChange from 'vm/shared/Lookup/methods/on-phrase-change';

/**
 * Handles phrase change event from idea form successor lookup
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.phrase
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
  const {
    vm: {
      main: {
        mindset: {zen}
      }
    }
  } = state;
  const {phrase} = required(data);

  const {form} = zen.pane;
  const {lookup} = form.successorSearchBox;

  return view('update-zen-idea-form-successor-search-box', {
    lookup: onPhraseChange({
      lookup,
      phrase,
      onPhraseChangeAction: action => dispatch(action)
    })
  });
}
