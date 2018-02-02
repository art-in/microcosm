import assert from 'utils/assert';

import isValidScale from 'model/utils/is-valid-scale';
import isValidPosition from 'model/utils/is-valid-position';

import Point from 'model/entities/Point';
import ViewboxType from 'vm/map/entities/Viewbox';

/**
 * Maps viewbox coordinates to viewport coordinates
 *
 * @param {Point} viewboxPos - position on viewbox
 * @param {ViewboxType} viewbox - viewbox mapped to viewport
 * @return {Point} viewport position
 */
export default function(viewboxPos, viewbox) {
  assert(isValidPosition(viewboxPos), `Invalid position '${viewboxPos}'`);
  assert(isValidScale(viewbox.scale), `Invalid scale '${viewbox.scale}'`);

  const x = viewboxPos.x * viewbox.scale;
  const y = viewboxPos.y * viewbox.scale;

  return new Point({x, y});
}
