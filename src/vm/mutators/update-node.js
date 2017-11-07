import update from 'utils/update-object';

/**
 * Updates node
 * 
 * @param {object} state
 * @param {object} data
 */
export default function updateNode(state, data) {
    const {graph} = state.vm.main.mindmap;
    const node = graph.nodes.find(n => n.id === data.id);

    update(node, data);
}