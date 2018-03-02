const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Compares two objects deeply
 *
 * @param {Object.<string, *>} objA
 * @param {Object.<string, *>} objB
 * @return {boolean}
 */
export default function isDeepEqualObjects(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    typeof objB !== 'object' ||
    objA === null ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // test for A's keys different from B
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !isDeepEqualObjects(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
