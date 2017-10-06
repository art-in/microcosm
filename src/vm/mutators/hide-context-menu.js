/**
 * Applies 'hide-context-menu' mutation
 * 
 * @param {object} state
 * @param {object} mutation
*/
export default function(state, mutation) {
    const {contextMenu} = state.vm.main.mindmap.graph;
    contextMenu.deactivate();
}