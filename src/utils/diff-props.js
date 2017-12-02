import diffArrays from './diff-arrays';

/**
 * Gets property names of object A which are not contained in object B
 * @param {Object.<string, *>} objA
 * @param {Object.<string, *>} objB
 * @return {Array.<string>}
 */
export default function diffProps(objA, objB) {
    return diffArrays(Object.keys(objA), Object.keys(objB));
}