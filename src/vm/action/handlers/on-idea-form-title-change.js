import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onTitleChange from 'vm/shared/IdeaForm/methods/on-title-change';

/**
 * Handles change event from title field of idea form modal
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.title
 * @return {PatchType}
 */
export default function(state, data) {
  const {
    vm: {
      main: {
        mindset: {mindmap}
      }
    }
  } = state;
  const {title} = required(data);

  const {form} = mindmap.ideaFormModal;

  return view('update-idea-form-modal', {
    form: onTitleChange(form, title)
  });
}
