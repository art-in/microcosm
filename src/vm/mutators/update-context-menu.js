import update from 'utils/update-object';

/**
 * Updates context menu
 * 
 * @param {object} state
 * @param {object} data
 */
export default function updateContextMenu(state, data) {
    const {contextMenu} = state.vm.main.mindmap.graph;

    update(contextMenu, data);
}