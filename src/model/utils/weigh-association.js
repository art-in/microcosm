import getDistance from 'utils/get-distance-between-points';
import PointType from 'model/entities/Point';

import isValidPosition from './is-valid-position';

/**
 * Gets weight of association
 * 
 * @param {PointType} headPos
 * @param {PointType} tailPos
 * @return {number}
 */
export default function weighAssociation(headPos, tailPos) {

    if (!isValidPosition(headPos)) {
        throw Error(`Invalid head position '${headPos}'`);
    }

    if (!isValidPosition(tailPos)) {
        throw Error(`Invalid tail position '${tailPos}'`);
    }

    return getDistance(tailPos, headPos);
}