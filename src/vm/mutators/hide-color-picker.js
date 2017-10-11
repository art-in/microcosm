/**
 * Applies 'hide-color-picker' mutation
 * 
 * @param {object} state
*/
export default function(state) {
    const {colorPicker} = state.vm.main.mindmap.graph;
    colorPicker.deactivate();
}