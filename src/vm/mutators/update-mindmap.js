import updateViewModel from "vm/utils/update-view-model";

import StateType from "boot/client/State";
import MindmapVmType from "vm/map/entities/Mindmap";

/**
 * Updates mindmap
 *
 * @param {StateType} state
 * @param {Partial<MindmapVmType>} data
 */
export default function updateMindmap(state, data) {
  const { mindmap } = state.vm.main.mindset;

  updateViewModel(mindmap, data);
}
