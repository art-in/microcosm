import assert from 'utils/assert';
import isValidScale from 'model/utils/is-valid-scale';

import {NODE_DOWNSCALE_RATE} from './get-node-scale-for-weight';

/**
 * Calculates focus weight for mindmap
 *
 * Focus weight - is weight of minimal path from root (RPW), which node should
 * have to be close to its original size for certain viewbox scale.
 * Focus weight is the center of mindmap focus weight zone.
 *
 * Ie. nodes with what RPW will look not resized with this mindmap scale.
 *
 * Note 1: result should be balanced with node downscaling logic.
 * Otherwise eg. if nodes will be downscaled faster than mindmap focus weight,
 * while zooming mindmap will focus smaller and smaller nodes until they cannot
 * be seen.
 *
 * Node 2: balancing focus weight can be implemented imperatively,
 * ie. by traversing nodes graph and finding RPW of nodes with resulting
 * scale closest to 1. But algorithmical approach will always be faster
 * (harder to read though).
 *
 * @param {number|undefined} viewboxScale
 * @return {number} RPW
 */
export default function getMindmapFocusWeightForScale(viewboxScale) {
  assert(isValidScale(viewboxScale), `Invalid viewbox scale '${viewboxScale}'`);

  // logarithmic progression
  // const rootPathWeight = Math.log2(viewboxScale) * NODE_DOWNSCALE_RATE;

  // linear progression
  const rootPathWeight = (viewboxScale - 1) * NODE_DOWNSCALE_RATE;

  // RPW cannot be negative
  return Math.max(rootPathWeight, 0);
}
