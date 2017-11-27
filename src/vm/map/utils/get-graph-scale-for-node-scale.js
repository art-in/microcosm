/**
 * Calculates graph viewbox scale to focus node
 * 
 * Ie. with what graph scale target node will look not resized
 * 
 * @param {number} nodeScale
 * @return {number} viewbox scale
 */
export default function getGraphScaleForNodeScale(nodeScale) {
    return 1 / nodeScale;
}