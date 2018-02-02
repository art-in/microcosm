import assert from 'utils/assert';

import Point from 'model/entities/Point';
import ViewboxType from 'vm/map/entities/Viewbox';
import isValidPosition from 'model/utils/is-valid-position';
import toViewboxCoords from './map-viewport-to-viewbox-coords';

/**
 * Maps viewport coordinates to canvas coordinates
 *
 * @param {Point} pos - position on viewport
 * @param {ViewboxType} viewbox - viewbox mapped to viewport
 * @return {Point} canvas position
 */
export default function mapViewportToCanvasCoords(pos, viewbox) {
  assert(
    isValidPosition(viewbox.topLeft),
    `Invalid viewbox top-left position '${viewbox.topLeft}'`
  );

  const viewboxPos = toViewboxCoords(pos, viewbox);

  const x = viewbox.topLeft.x + viewboxPos.x;
  const y = viewbox.topLeft.y + viewboxPos.y;

  return new Point({x, y});
}
