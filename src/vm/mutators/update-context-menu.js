import update from 'utils/update-object';

import StateType from 'boot/client/State';
import ContextMenuType from 'vm/shared/ContextMenu';

/**
 * Updates context menu
 * 
 * @param {StateType} state
 * @param {Partial<ContextMenuType>} data
 */
export default function updateContextMenu(state, data) {
    const {contextMenu} = state.vm.main.mindmap.graph;

    update(contextMenu, data);
}