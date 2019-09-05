import updateObject from 'utils/update-object';

/**
 * Initializes properties of new class instance
 *
 * @example
 * class A {
 *      prop1,
 *      prop2,
 *      constructor(props) {
 *          initProps(this, props)
 *      }
 * }
 *
 * const a = new A({prop1: 1, prop2: 2})
 *
 * @template T
 * @param {T} instance
 * @param {Partial<T>} [propsObj]
 */
export default function initProps(instance, propsObj) {
  if (propsObj === undefined) {
    // props not received
    return;
  }

  try {
    updateObject(instance, propsObj);
  } catch (e) {
    throw Error(`Invalid instance properties: ${e.message}`);
  }
}
