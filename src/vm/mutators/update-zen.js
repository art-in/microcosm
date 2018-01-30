import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import ZenType from 'vm/zen/entities/Zen';

/**
 * Updates zen
 *
 * @param {StateType} state
 * @param {Partial<ZenType>} data
 */
export default function updateZen(state, data) {
  const {zen} = state.vm.main.mindset;

  updateViewModel(zen, data);
}
