import update from 'utils/update-object';

/**
 * Updates graph
 * 
 * @param {object} state
 * @param {object} data
 */
export default function updateGraph(state, data) {
    const {graph} = state.vm.main.mindmap;

    update(graph, data);

    graph.emit('change');
}