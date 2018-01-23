/**
 * Checks whether object has no properties
 *
 * @param {Object.<string, *>} obj
 * @return {boolean}
 */
export default function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
