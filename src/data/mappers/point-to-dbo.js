import PointType from 'model/entities/Point';

/**
 * Maps point to dbo
 * @param {PointType} point - model
 * @return {object}
 */
export default function pointToDbo(point) {
    const dbo = {};

    dbo.x = point.x;
    dbo.y = point.y;

    return dbo;
}