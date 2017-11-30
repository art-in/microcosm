import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates graph
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function updateGraph(state, data) {
    const {graph} = state.vm.main.mindmap;

    update(graph, data);
}