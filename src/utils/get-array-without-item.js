/**
 * Creates new array without item on target index
 * 
 * @param {array} array
 * @param {number} index
 * @return {array}
 */
export default function getArrayWithoutItem(array, index) {
    return [
        ...array.slice(0, index),
        ...array.slice(index + 1, array.length)
    ];
}