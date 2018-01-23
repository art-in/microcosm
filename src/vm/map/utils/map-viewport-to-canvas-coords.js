import Point from "model/entities/Point";

import toViewboxCoords from "./map-viewport-to-viewbox-coords";

/**
 * Maps viewport coordinates to canvas coordinates
 *
 * @param {Point}  pos     - position on viewport
 * @param {object} viewbox - viewbox mapped to viewport
 * @return {Point} canvas position
 */
export default function mapViewportToCanvasCoords(pos, viewbox) {
  const viewboxPos = toViewboxCoords(pos, viewbox);

  const x = viewbox.x + viewboxPos.x;
  const y = viewbox.y + viewboxPos.y;

  return new Point({ x, y });
}
