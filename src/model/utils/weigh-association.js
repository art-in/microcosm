import isValidPosition from './is-valid-position';
import getDistance from 'utils/get-distance-between-points';

/**
 * Gets weight of association
 * 
 * @param {Point} headPos
 * @param {Point} tailPos
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