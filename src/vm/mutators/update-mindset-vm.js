import updateViewModel from "vm/utils/update-view-model";

import StateType from "boot/client/State";
import MindsetType from "vm/main/Mindset";

/**
 * Updates mindset view model
 *
 * TODO: get rid of silly name 'update-mindset-vm'
 *       this is where model and view model names collide
 *
 * @param {StateType} state
 * @param {Partial<MindsetType>} data
 */
export default function updateMindset(state, data) {
  const { mindset } = state.vm.main;

  updateViewModel(mindset, data);
}
