const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Compares two objects shallowly
 *
 * Source:
 * https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js
 *
 * @param {Object.<string, *>} objA
 * @param {Object.<string, *>} objB
 * @return {boolean}
 */
export default function isShallowEqualObjects(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
