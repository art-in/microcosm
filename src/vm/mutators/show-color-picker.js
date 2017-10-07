import required from 'utils/required-params';

/**
 * Applies 'show-color-picker' mutation
 * 
 * @param {object}   state
 * @param {object}   data
 * @param {function} data.onSelectAction
 */
export default function(state, data) {
    const {colorPicker} = state.vm.main.mindmap.graph;
    const {onSelectAction} = required(data);

    // TODO: rename getter name to smth better
    //       (to not sound like handler)
    colorPicker.activate({onSelectAction});
}