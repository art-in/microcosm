import PatchType from 'utils/state/Patch';
import view from 'vm/utils//view-patch';

import StateType from 'boot/client/State';

/**
 * Handles cancel event from idea form modal
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {mindmap}}}} = state;

  const {form} = mindmap.ideaFormModal;

  return view('update-idea-form-modal', {
    form: {
      title: form.prev.title,
      value: form.prev.value,
      color: form.prev.color,
      successors: form.prev.successors,
      isTitleValid: true,
      isEditingValue: false,
      isSaveable: false,
      isCancelable: false
    }
  });
}
