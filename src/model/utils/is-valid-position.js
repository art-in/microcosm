/**
 * Checks whether position is valid
 * 
 * @param {Point} pos 
 * @return {boolean}
 */
export default function isValidPosition(pos) {
    return typeof pos === 'object'
        && Number.isFinite(pos.x) && Number.isFinite(pos.y);
}