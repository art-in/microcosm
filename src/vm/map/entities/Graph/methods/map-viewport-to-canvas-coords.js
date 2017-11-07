import Point from 'model/entities/Point';

import mapToViewboxCoords from './map-viewport-to-viewbox-coords';

/**
 * Maps viewport coordinates to canvas coordinates
 * 
 * @param {Point}  pos     - position on viewport
 * @param {object} viewbox - viewbox mapped to viewport
 * @return {Point} canvas position
 */
export default function mapViewportToCanvasCoords(pos, viewbox) {

    const posOnViewbox = mapToViewboxCoords(pos, viewbox);

    const x = viewbox.x + posOnViewbox.x;
    const y = viewbox.y + posOnViewbox.y;

    return new Point({x, y});
}