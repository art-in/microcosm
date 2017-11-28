import GraphType from 'vm/map/entities/Graph';
import NodeType from 'vm/map/entities/Node';

/**
 * Gets node by ID
 *
 * @param {GraphType} graph
 * @param {string} nodeId
 * @return {NodeType}
 */
export default function getNode(graph, nodeId) {
    
    const node = graph.nodes.find(n => n.id === nodeId);

    if (!node) {
        throw Error(`Node with ID '${nodeId}' not found in graph`);
    }

    return node;
}