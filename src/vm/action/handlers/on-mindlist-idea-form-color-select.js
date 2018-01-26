import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

/**
 * Handles color select event from mindlist idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  return view('update-color-picker', {
    active: true,
    initialColor: form.color,
    onSelectAction: ({color}) => ({
      type: 'on-mindlist-idea-form-color-change',
      data: {color}
    })
  });
}
