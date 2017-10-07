/**
 * Applies 'hide-context-menu' mutation
 * 
 * @param {object} state
*/
export default function(state) {
    const {contextMenu} = state.vm.main.mindmap.graph;
    contextMenu.deactivate();
}