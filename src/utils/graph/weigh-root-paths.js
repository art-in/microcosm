import calcRootPaths from 'utils/graph/calc-root-paths';

/**
 * Calculates minimal root paths (MRP) for each node in the graph
 * and stores results in graph entities
 * 
 * @param {object} rootNode
 */
export default function weighRootPaths(rootNode) {
    const weightsData = calcRootPaths(rootNode);

    weightsData.forEach(data => {
        const node = data.node;
        node.rootPathWeight = data.rootPathWeight;
        node.linkFromParent = data.linkFromParent;
        node.linksToChilds = data.linksToChilds;
    });
}