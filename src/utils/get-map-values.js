/**
 * Gets values of Map object
 *
 * @example
 * const map = new Map([1, 'A'], [2, 'B']);
 * getMapValues(map); // ['A', 'B']
 *
 * @template Idx, T
 * @param {Map.<Idx, T>} map
 * @return {Array.<T>} values
 */
export default function getMapValues(map) {
  return [...map.values()];
}
