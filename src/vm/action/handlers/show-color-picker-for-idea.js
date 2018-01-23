import required from 'utils/required-params';
import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

/**
 * Shows color picker for selecting idea color
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId - ID of target idea
 * @return {PatchType}
 */
export default function showColorPickerForIdea(state, data) {
  const {ideaId} = required(data);

  return view('update-color-picker', {
    active: true,
    onSelectAction: ({color}) => ({
      type: 'on-idea-color-selected',
      data: {
        ideaId,
        color
      }
    })
  });
}
