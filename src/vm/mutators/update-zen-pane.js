import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import ZenType from 'vm/zen/entities/Zen';

/**
 * Updates zen idea pane
 * TODO: rename to 'update-zen-pane' for briefity
 *
 * @param {StateType} state
 * @param {Partial<ZenType>} data
 */
export default function updateZenIdeaPane(state, data) {
  const {zen} = state.vm.main.mindset;

  updateViewModel(zen.pane, data);
}
