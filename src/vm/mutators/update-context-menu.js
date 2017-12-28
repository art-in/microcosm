import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import ContextMenuType from 'vm/shared/ContextMenu';

/**
 * Updates context menu
 * 
 * @param {StateType} state
 * @param {Partial<ContextMenuType>} data
 */
export default function updateContextMenu(state, data) {
    const {contextMenu} = state.vm.main.mindset.graph;

    updateViewModel(contextMenu, data);
}