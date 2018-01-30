import required from 'utils/required-params';
import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onColorChange from 'vm/shared/IdeaForm/methods/on-color-change';

/**
 * Handles color change event from idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.color
 * @return {PatchType}
 */
export default function(state, data) {
  const {vm: {main: {mindset: {zen}}}} = state;
  const {color} = required(data);

  const {form} = zen.pane;

  return view('update-zen-idea-pane', {
    form: onColorChange(form, color)
  });
}
