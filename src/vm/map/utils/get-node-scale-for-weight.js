import isValidPathWeight from 'utils/graph/is-valid-path-weight';

/**
 * Calculates node scale according to its root path weight (RPW).
 * Greater RPW - smaller node should be.
 * 
 * Ie. how much size of node with this RPW should change relatively
 * to its normal size.
 * 
 * @param {number|undefined} rootPathWeight
 * @return {number} node scale
 */
export default function getNodeScaleForWeight(rootPathWeight) {

    if (!isValidPathWeight(rootPathWeight)) {
        throw Error(`Invalid root path weight '${rootPathWeight}'`);
    }
    
    // TODO: decide on node downscaling func
    // logarithmic progression
    // return 1 / (Math.pow(2, rootPathWeight / nodeDownscaleRate));

    // linear progression
    return nodeDownscaleRate / (rootPathWeight + nodeDownscaleRate);
}

/**
 * Amount of RPW that downscales node in linear progression.
 * Greater value - slower nodes are downscaled.
 * 
 *  RPW   |  node scale
 *  ------|-------------
 *  0     |  1
 *  500   |  1/2
 *  1000  |  1/3
 *  1500  |  1/4
 *  2000  |  1/5
 *
 */
export const nodeDownscaleRate = 500;