import isValidPosition from './is-valid-position';

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

    // calc length by pythagorean
    const dx = tailPos.x - headPos.x;
    const dy = tailPos.y - headPos.y;

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}