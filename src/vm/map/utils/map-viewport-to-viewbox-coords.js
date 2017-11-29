import Point from 'model/entities/Point';

/**
 * Maps viewport coordinates to viewbox coordinates
 * 
 * @param {Point}  pos     - position on viewport
 * @param {object} viewbox - viewbox mapped to viewport
 * @return {Point} viewbox position
 */
export default function(pos, viewbox) {

    // TODO: remove ts-ignore when ts fixes "Object is possibly 'undefined'"
    // https://github.com/Microsoft/TypeScript/issues/13369
    // @ts-ignore
    const x = pos.x / viewbox.scale;

    // @ts-ignore
    const y = pos.y / viewbox.scale;

    return new Point({x, y});
}