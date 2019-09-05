/**
 * Returns shallow difference between items in array A and B
 *
 * How A should be modified to equal B?
 *
 * @template T
 * @param {Array.<T>} arrayA
 * @param {Array.<T>} arrayB
 * @return {{add: Array.<T>, del: Array.<T>}}
 */
export default function diffArrays(arrayA, arrayB) {
  return {
    add: arrayB.filter(i => arrayA.indexOf(i) == -1),
    del: arrayA.filter(i => arrayB.indexOf(i) == -1)
  };
}
