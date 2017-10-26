import update from 'utils/update-object';

/**
 * Updates color picker
 * 
 * @param {object} state
 * @param {object} data
 */
export default function updateColorPicker(state, data) {
    const {colorPicker} = state.vm.main.mindmap.graph;

    update(colorPicker, data);
}