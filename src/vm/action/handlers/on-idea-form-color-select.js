import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

/**
 * Handles color select event from idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {mindmap}}}} = state;

  const {form} = mindmap.ideaFormModal;

  return view('update-color-picker', {
    active: true,
    initialColor: form.color,
    onSelectAction: ({color}) => ({
      type: 'on-idea-form-color-change',
      data: {color}
    })
  });
}
