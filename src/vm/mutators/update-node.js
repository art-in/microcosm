import update from 'utils/update-object';

/**
 * Updates graph
 * 
 * @param {object} state
 * @param {object} data
 */
export default function updateGraph(state, data) {
    const {graph} = state.vm.main.mindmap;
    const node = graph.nodes.find(n => n.id === data.id);

    update(node, data);
}