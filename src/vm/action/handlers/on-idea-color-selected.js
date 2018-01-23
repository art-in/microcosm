import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

/**
 * Handles idea color selected with color picker
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {string} data.color
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function onIdeaColorSelected(state, data, dispatch) {
  const {ideaId, color} = required(data);

  dispatch({
    type: 'set-idea-color',
    data: {ideaId, color}
  });

  return view('update-color-picker', {active: false});
}
