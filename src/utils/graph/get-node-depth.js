/**
 * Gets depth of single node in the graph.
 * 
 * Can be used for calculating depth of new nodes.
 * 
 * After adding/removing cross-links, one should recalc
 * depth of tail node and also all nodes in tail sub-graph.
 * 
 * It expects that predecessor nodes already have depths set.
 * 
 * @param {object} node
 * @return {object} node
 */
export default function calcDepth(node) {

    const predecessors = node.linksIn.map(link => link.from);

    if (predecessors.length === 0) {
        // ensure incoming nodes were set before depth calc.
        // depth of root node should not be calculated anyway.
        throw Error('Node has no predecessors');
    }

    const predecessorDepths = predecessors
        .map(predecessor => {
            
            // ensure predecessors have depth set and it is valid number.
            const {depth} = predecessor;
            if (!Number.isInteger(depth)) {
                throw Error(`Node predecessor has invalid depth '${depth}'`);
            }

            return predecessor.depth;
        });

    return Math.min(...predecessorDepths) + 1;
}