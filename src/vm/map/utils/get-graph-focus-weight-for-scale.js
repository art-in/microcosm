import {nodeDownscaleRate} from './get-node-scale-for-weight';

/**
 * Calculates focus weight for graph
 * 
 * Focus weight - is weight of minimal path from root (RPW), which node should
 * have to be close to its original size for certain viewbox scale.
 * 
 * Ie. nodes with what RPW will look not resized with this graph scale.
 * 
 * Note 1: result should be balanced with node downscaling logic.
 * Otherwise eg. if nodes will be downscaled faster than graph focus weight,
 * while zooming graph will focus smaller and smaller nodes until they cannot
 * be seen.
 * 
 * Node 2: balancing focus weight can be implemented imperatively,
 * ie. by traversing nodes graph and finding RPW of nodes with resulting
 * scale closest to 1. But algorithmical approach will always be faster
 * (harder to read though).
 * 
 * @param {number} viewboxScale
 * @return {number} RPW
*/
export default function getGraphFocusWeightForScale(viewboxScale) {
    if (!Number.isFinite(viewboxScale) || viewboxScale <= 0) {
        throw Error(`Invalid viewbox scale '${viewboxScale}'`);
    }

    const weight = Math.round((viewboxScale - 1) * nodeDownscaleRate);

    // RPW cannot be negative
    return Math.max(weight, 0);
}