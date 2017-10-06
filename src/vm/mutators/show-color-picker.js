import assert from 'assert';

/**
 * Applies 'show-color-picker' mutation
 * 
 * @param {object}   state
 * @param {object}   mutation
 * @param {function} mutation.data.onSelectAction
 */
export default function(state, mutation) {

    const {colorPicker} = state.vm.main.mindmap.graph;
    const {onSelectAction} = mutation.data;

    assert(onSelectAction);

    // TODO: rename getter name to smth better
    //       (to not sound like handler)
    colorPicker.activate({onSelectAction});
}