/**
 * Compares two arrays shallowly, ignoring order
 *
 * @param {array} arrA
 * @param {array} arrB
 * @return {boolean}
 */
export default function isShallowEqualArrays(arrA, arrB) {
  if (arrA === arrB) {
    return true;
  }

  if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
    return false;
  }

  if (arrB.length !== arrA.length) {
    return false;
  }

  return arrA.every(i => arrB.includes(i));
}
