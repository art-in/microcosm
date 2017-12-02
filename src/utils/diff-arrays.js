/**
 * Gets items of array A which are not contained in array B
 * 
 * @param {array} arrayA
 * @param {array} arrayB
 * @return {array}
 */
export default function diffArrays(arrayA, arrayB) {
    return arrayA.filter(x => arrayB.indexOf(x) == -1);
}