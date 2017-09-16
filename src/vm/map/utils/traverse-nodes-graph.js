import traverseGraph from 'utils/graph/traverse-graph';

/**
 * Calls function on each node in the graph
 * @param {Node} node - root node
 * @param {function} visit
 */
export default function(node, visit) {
    traverseGraph({
        node,
        visit
    });
}