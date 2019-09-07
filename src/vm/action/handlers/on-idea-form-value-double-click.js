import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onValueDoubleClick from 'vm/shared/IdeaForm/methods/on-value-double-click';

/**
 * Handles double click event from value field of idea form modal
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {
    vm: {
      main: {
        mindset: {mindmap}
      }
    }
  } = state;

  const {form} = mindmap.ideaFormModal;

  const formUpdate = onValueDoubleClick(form);

  if (!formUpdate) {
    return;
  }

  return view('update-idea-form-modal', {
    form: formUpdate
  });
}
