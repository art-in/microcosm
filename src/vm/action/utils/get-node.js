/**
 * Gets node by ID
 *
 * @param {Graph} graph
 * @param {string} nodeId
 * @return {Node}
 */
export default function getNode(graph, nodeId) {
    
    const node = graph.nodes.find(n => n.id === nodeId);

    if (!node) {
        throw Error(`Node with ID '${nodeId}' not found in graph`);
    }

    return node;
}