import PointType from 'model/entities/Point';

/**
 * Checks whether position is valid
 * 
 * @param {PointType} pos 
 * @return {boolean}
 */
export default function isValidPosition(pos) {
    return typeof pos === 'object'

        // @ts-ignore
        && Number.isFinite(pos.x) && Number.isFinite(pos.y);
}