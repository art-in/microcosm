import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';

/**
 * Updates color picker
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function updateColorPicker(state, data) {
    const {colorPicker} = state.vm.main.mindset.graph;

    updateViewModel(colorPicker, data);
}