import assert from 'utils/assert';

import isValidScale from 'model/utils/is-valid-scale';
import isValidPosition from 'model/utils/is-valid-position';

import Point from 'model/entities/Point';
import ViewboxType from 'vm/map/entities/Viewbox';

/**
 * Maps viewport coordinates to viewbox coordinates
 *
 * @param {Point} pos - position on viewport
 * @param {ViewboxType} viewbox - viewbox mapped to viewport
 * @return {Point} viewbox position
 */
export default function(pos, viewbox) {
  assert(isValidPosition(pos), `Invalid position '${pos}'`);
  assert(isValidScale(viewbox.scale), `Invalid viewbox '${viewbox.scale}'`);

  const x = pos.x / viewbox.scale;
  const y = pos.y / viewbox.scale;

  return new Point({x, y});
}
