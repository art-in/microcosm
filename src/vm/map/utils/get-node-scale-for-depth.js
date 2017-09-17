/**
 * Calculates node's scale according to its depth in graph.
 * Deeper node in the graph - smaller it should be.
 * 
 * Ie. how much size of node on this depth in graph
 * should change relatively to its normal size
 * 
 * @param {number} nodeDepth
 * @return {number} scale factor (0; 1)
 */
export default function getNodeScaleForDepth(nodeDepth) {
    return 1 / (nodeDepth + 1);
}