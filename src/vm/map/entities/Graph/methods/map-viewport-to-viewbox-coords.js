import assert from 'utils/assert';
import Point from 'vm/shared/Point';

/**
 * Maps viewport coordinates to viewbox coordinates
 * 
 * @param {Point}  pos     - position on viewport
 * @param {object} viewbox - viewbox mapped to viewport
 * @return {Point} viewbox position
 */
export default function(pos, viewbox) {
    assert(pos instanceof Point);

    const x = pos.x / viewbox.scale;
    const y = pos.y / viewbox.scale;

    return new Point({x, y});
}