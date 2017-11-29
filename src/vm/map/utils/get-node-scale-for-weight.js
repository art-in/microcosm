import isValidPathWeight from 'utils/graph/is-valid-path-weight';

/**
 * Calculates node scale according to its root path weight (RPW).
 * Greater RPW - smaller node should be.
 * 
 * Ie. how much size of node with this RPW should change relatively
 * to its normal size.
 * 
 * @param {number|undefined} rootPathWeight
 * @return {number} scale
 */
export default function getNodeScaleForWeight(rootPathWeight) {

    if (!isValidPathWeight(rootPathWeight)) {
        throw Error(`Invalid root path weight '${rootPathWeight}'`);
    }
    
    return nodeDownscaleRate / (rootPathWeight + nodeDownscaleRate);
}

/**
 * Amount of RPW that downscales node in one more time.
 * Greater value - slower nodes will be downscaled.
 */
export const nodeDownscaleRate = 1000;