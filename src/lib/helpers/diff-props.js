import diffArrays from './diff-arrays';

/**
 * Gets property names of object A which are not contained in object B
 * @param {object} objA
 * @param {object} objB
 * @return {array}
 */
export default function diffProps(objA, objB) {
    return diffArrays(Object.keys(objA), Object.keys(objB));
}