import updateViewModel from 'vm/utils/update-view-model';

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

    updateViewModel(node, data);

    node.edgesIn.forEach(link => link.isDirty = true);
    node.edgesOut.forEach(link => link.isDirty = true);
}