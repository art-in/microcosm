/**
 * Returns new array without item on target index
 * 
 * @template T
 * @param {Array.<T>} array
 * @param {number} index
 * @return {Array.<T>}
 */
export default function getArrayWithoutItem(array, index) {
    const a = Array.from(array);
    a.splice(index, 1);
    return a;
}