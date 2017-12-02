/**
 * Creates new array without item on target index
 * 
 * @template T
 * @param {Array.<T>} array
 * @param {number} index
 * @return {Array.<T>}
 */
export default function getArrayWithoutItem(array, index) {
    return [
        ...array.slice(0, index),
        ...array.slice(index + 1, array.length)
    ];
}