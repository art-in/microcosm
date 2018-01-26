import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onColorRemove from 'vm/shared/IdeaForm/methods/on-color-remove';

/**
 * Handles color remove event from idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {mindmap}}}} = state;

  const {form} = mindmap.ideaFormModal;

  return view('update-idea-form-modal', {
    form: onColorRemove(form)
  });
}
