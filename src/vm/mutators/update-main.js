import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import MainVmType from 'vm/main/Main';

/**
 * Updates main view model
 *
 * @param {StateType} state
 * @param {Partial<MainVmType>} data
 */
export default function updateMain(state, data) {
  const {main} = state.vm;

  updateViewModel(main, data);
}
