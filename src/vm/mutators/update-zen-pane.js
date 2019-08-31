import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import ZenType from 'vm/zen/entities/Zen';

/**
 * Updates zen idea pane
 *
 * @param {StateType} state
 * @param {Partial<ZenType>} data
 */
export default function updateZenPane(state, data) {
  const {zen} = state.vm.main.mindset;

  updateViewModel(zen.pane, data);
}
