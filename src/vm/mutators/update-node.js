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

    if (data.posAbs) {
        // mark related edges as dirty if changing node position,
        // since links positions depend on node position
        node.edgesIn.forEach(link => link.isDirty = true);
        node.edgesOut.forEach(link => link.isDirty = true);
    }
}