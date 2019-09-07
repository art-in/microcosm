import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onValueChange from 'vm/shared/IdeaForm/methods/on-value-change';

/**
 * Handles change event from value field of idea form modal
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.value
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
  const {value} = required(data);

  const {form} = mindmap.ideaFormModal;

  return view('update-idea-form-modal', {
    form: onValueChange(form, value)
  });
}
