import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onToggleValueEdit from 'vm/shared/IdeaForm/methods/on-toggle-value-edit';

/**
 * Handles toggle edit event from value field of zen idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {zen}}}} = state;

  const {form} = zen.pane;

  return view('update-zen-idea-pane', {
    form: onToggleValueEdit(form)
  });
}
