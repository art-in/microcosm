import update from 'utils/update-object';

import StateType from 'boot/client/State';

/**
 * Updates node
 * 
 * @param {StateType} state
 * @param {object} data
 */
export default function updateNode(state, data) {
    const {graph} = state.vm.main.mindmap;
    const node = graph.nodes.find(n => n.id === data.id);

    update(node, data);
}