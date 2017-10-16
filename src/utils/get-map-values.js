import assert from 'utils/assert';

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
    assert(map instanceof Map, `Invalid map object '${map}'`);
    return [...map.values()];
}