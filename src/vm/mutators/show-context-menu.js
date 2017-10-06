import assert from 'assert';

import Point from 'vm/shared/Point';
import MenuItem from 'vm/shared/MenuItem';

/** 
 * Applies 'show-context-menu' mutation
 * 
 * @param {object}           state
 * @param {object}           mutation
 * @param {Point}            mutation.data.pos
 * @param {array.<MenuItem>} mutation.data.menuItems
 */
export default function showContextMenu(state, mutation) {
    
    const {contextMenu} = state.vm.main.mindmap.graph;
    const {pos, menuItems} = mutation.data;

    assert(pos instanceof Point);
    assert(menuItems.every(i => i instanceof MenuItem));

    contextMenu.setItems(menuItems);
    contextMenu.activate({pos});
}