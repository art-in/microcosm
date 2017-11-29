/**
 * Gets values of Map object
 * 
 * @example
 * const map = new Map([1, 'A'], [2, 'B']);
 * getMapValues(map); // ['A', 'B']
 * 
 * @param {Map} map
 * @return {array} values
 */
export default function getMapValues(map) {
    return [...map.values()];
}