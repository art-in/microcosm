import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates context menu
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function updateContextMenu(state, data) {
    const {contextMenu} = state.vm.main.mindmap.graph;

    update(contextMenu, data);
}