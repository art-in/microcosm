import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import MindmapType from 'vm/main/Mindmap';

/**
 * Updates mindmap view model
 * 
 * TODO: get rid of silly name 'update-mindmap-vm'
 *       this is where model and view model names collide
 * 
 * @param {StateType} state
 * @param {Partial<MindmapType>} data
 */
export default function updateMindmap(state, data) {
    const {mindmap} = state.vm.main;

    updateViewModel(mindmap, data);
}