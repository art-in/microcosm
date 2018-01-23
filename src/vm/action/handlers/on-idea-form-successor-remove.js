import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import removeSuccessor from 'vm/shared/IdeaForm/methods/remove-successor';

/**
 * Handles successor remove event from idea form successors list
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @return {PatchType}
 */
export default function(state, data) {
  const {vm: {main: {mindset: {mindmap: {ideaFormModal: {form}}}}}} = state;
  const {ideaId} = required(data);

  return view('update-idea-form-modal', {
    form: removeSuccessor(form, ideaId)
  });
}
