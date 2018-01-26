import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import MindlistType from 'vm/list/entities/Mindlist';

/**
 * Updates mindlist
 *
 * @param {StateType} state
 * @param {Partial<MindlistType>} data
 */
export default function updateMindlist(state, data) {
  const {list} = state.vm.main.mindset;

  updateViewModel(list, data);
}
