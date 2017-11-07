/**
 * Calculates minimal root path (MRP) for single node in the graph.
 * 
 * Note: this is optimization for new nodes only, to avoid MRP recalc
 * of entire graph.
 * 
 * Caution: do not use when adding cross-links.
 * New cross-links can cause MRP change for surrounding nodes too,
 * so it is better to either recalc MRP of all nodes in the graph
 * or introduce some optimization and find all affected nodes.
 * 
 * It expects that predecessor nodes already have root path weight set.
 * 
 * @param {object} node
 * @return {object} root path data
 */
export default function calcRootPathForNode(node) {

    if (!node.linksIn || node.linksIn.length === 0) {
        // ensure all incoming links set.
        // MRP of root node should not be calculated anyway.
        throw Error(`Node '${node.id}' has no predecessors`);
    }

    let rootPathWeight;
    let linkFromParent;

    node.linksIn
        .forEach(link => {
            const predecessor = link.from;

            // ensure all predecessors have root path weight set
            const predecessorRPW = predecessor.rootPathWeight;
            if (!Number.isFinite(predecessorRPW) || predecessorRPW < 0) {
                throw Error(
                    `Node '${predecessor.id}' has invalid root path weight ` +
                    `'${predecessorRPW}'`);
            }

            // ensure all links have weight set
            if (!Number.isFinite(link.weight) || link.weight <= 0) {
                throw Error(
                    `Link '${link.id}' has invalid weight '${link.weight}'`);
            }

            // weight of proposed path (root->...->predecessor->node)
            const pathWeight = predecessorRPW + link.weight;

            // check if proposed path is better then current one
            if (rootPathWeight === undefined || pathWeight < rootPathWeight) {
                rootPathWeight = pathWeight;
                linkFromParent = link;
            }
        });

    return {
        rootPathWeight,
        linkFromParent
    };
}