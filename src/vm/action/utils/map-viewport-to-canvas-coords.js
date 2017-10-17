import Point from 'vm/shared/Point';

/**
 * Maps viewport coordinates to canvas coordinates
 * 
 * @param {Point}  pos     - position on viewport
 * @param {object} viewbox - viewbox mapped to viewport
 * @return {Point} canvas position
 */
export default function mapViewportToCanvasCoords(pos, viewbox) {

    const {x: viewportX, y: viewportY} = pos;

    const x = viewbox.x + viewportX / viewbox.scale;
    const y = viewbox.y + viewportY / viewbox.scale;

    return new Point(x, y);
}