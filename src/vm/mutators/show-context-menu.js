import required from 'utils/required-params';

/** 
 * Applies 'show-context-menu' mutation
 * 
 * @param {object}           state
 * @param {object}           data
 * @param {Point}            data.pos
 * @param {array.<MenuItem>} data.menuItems
 */
export default function showContextMenu(state, data) {
    const {contextMenu} = state.vm.main.mindmap.graph;
    const {pos, menuItems} = required(data);

    contextMenu.setItems(menuItems);
    contextMenu.activate({pos});
}