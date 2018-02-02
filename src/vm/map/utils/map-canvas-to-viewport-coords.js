import PointType from 'model/entities/Point';
import ViewboxType from 'vm/map/entities/Viewbox';

import toViewportCoords from './map-viewbox-to-viewport-coords';

/**
 * Maps canvas coordinates to viewport coordinates
 *
 * @param {PointType} canvasPos - position on canvas
 * @param {ViewboxType} viewbox - viewbox mapped to viewport
 * @return {PointType} viewport position
 */
export default function mapCanvasToViewport(canvasPos, viewbox) {
  const viewboxPos = {
    x: canvasPos.x - viewbox.topLeft.x,
    y: canvasPos.y - viewbox.topLeft.y
  };

  const viewportPos = toViewportCoords(viewboxPos, viewbox);

  return viewportPos;
}
