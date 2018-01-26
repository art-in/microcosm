import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onToggleValueEdit from 'vm/shared/IdeaForm/methods/on-toggle-value-edit';

/**
 * Handles toggle edit event from value field of idea form modal
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {mindmap}}}} = state;

  const {form} = mindmap.ideaFormModal;

  return view('update-idea-form-modal', {
    form: onToggleValueEdit(form)
  });
}
