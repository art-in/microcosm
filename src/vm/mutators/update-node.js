import update from 'utils/update-object';

import StateType from 'boot/client/State';
import NodeType from 'vm/map/entities/Node';

/**
 * Updates node
 * 
 * @param {StateType} state
 * @param {Partial<NodeType>} data
 */
export default function updateNode(state, data) {
    const {graph} = state.vm.main.mindmap;
    const node = graph.nodes.find(n => n.id === data.id);

    update(node, data);
}