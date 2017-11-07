/**
 * Maps point to dbo
 * @param {Point} point - model
 * @return {object}
 */
export default function pointToDbo(point) {
    const dbo = {};

    dbo.x = point.x;
    dbo.y = point.y;

    return dbo;
}