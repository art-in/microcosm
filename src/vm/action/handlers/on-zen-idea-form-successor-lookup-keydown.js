import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';
import isEmpty from 'utils/is-empty-object';

import StateType from 'boot/client/State';

import onKeyDown from 'vm/shared/Lookup/methods/on-keydown';

/**
 * Handles keydown event from idea form successor lookup
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.code
 * @param {function} data.preventDefault
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {zen}}}} = state;
  const {code, preventDefault} = required(data);

  const {form} = zen.pane;
  const {lookup} = form.successorSearchBox;

  const lookupUpdate = onKeyDown({
    lookup,
    code,
    preventDefault,
    onSuggestionSelect: ({suggestion}) => {
      dispatch({
        type: 'on-zen-idea-form-successor-lookup-suggestion-select',
        data: {suggestion}
      });
    }
  });

  if (!isEmpty(lookupUpdate)) {
    return view('update-zen-idea-form-successor-search-box', {
      lookup: lookupUpdate
    });
  }
}
