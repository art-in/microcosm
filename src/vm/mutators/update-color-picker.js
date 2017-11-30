import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates color picker
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function updateColorPicker(state, data) {
    const {colorPicker} = state.vm.main.mindmap.graph;

    update(colorPicker, data);
}