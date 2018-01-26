import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import onValueDoubleClick from 'vm/shared/IdeaForm/methods/on-value-double-click';

/**
 * Handles double click event from value field of mindlist idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  const formUpdate = onValueDoubleClick(form);

  if (!formUpdate) {
    return;
  }

  return view('update-mindlist-idea-pane', {
    form: formUpdate
  });
}
