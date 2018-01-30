import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';
import onValueDoubleClick from 'vm/shared/IdeaForm/methods/on-value-double-click';

/**
 * Handles double click event from value field of zen idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {zen}}}} = state;

  const {form} = zen.pane;

  const formUpdate = onValueDoubleClick(form);

  if (!formUpdate) {
    return;
  }

  return view('update-zen-pane', {
    form: formUpdate
  });
}
