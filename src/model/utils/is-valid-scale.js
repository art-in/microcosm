/**
 * Checks whether scale is valid
 * 
 * @param {number} scale - graph viewbox or node scale
 * @return {boolean}
 */
export default function isValidScale(scale) {

    return scale !== undefined && scale > 0;
}