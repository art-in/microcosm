import Point from 'model/entities/Point';

/**
 * Maps viewbox coordinates to viewport coordinates
 * 
 * @param {Point}  viewboxPos - position on viewbox
 * @param {object} viewbox - viewbox mapped to viewport
 * @return {Point} viewport position
 */
export default function(viewboxPos, viewbox) {

    const x = viewboxPos.x * viewbox.scale;
    const y = viewboxPos.y * viewbox.scale;

    return new Point({x, y});
}