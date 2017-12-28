/**
 * Calculates mindmap viewbox scale to focus node
 * 
 * Ie. with what mindmap scale target node will look not resized
 * 
 * @param {number} nodeScale
 * @return {number} viewbox scale
 */
export default function getMindmapScaleForNode(nodeScale) {
    return 1 / nodeScale;
}