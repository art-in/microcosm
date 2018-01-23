import noop from "utils/noop";

/**
 * Updates object props deeply and safely
 *
 * Fails on:
 * - attempt to create new props
 * - attempt to change types of existing props
 *
 * @example
 * const target = {a: 1, b: 3}
 * updateObject(target, {b: 2})
 * target // {a: 1, b: 2}
 *
 * @example unknown props
 * const target = {a: 1, b: 2}
 * updateObject(target, {c: 3}) // Error
 *
 * @example deep update
 * const target = {nested: {a: 1}}
 * updateObject(target, {nested: {a: 2}})
 * target // {nested: {a: 2}}
 *
 * @template T
 * @param {T} target
 * @param {Partial<T>} source
 * @param {function} [shouldUpdate] - custom prop handler. return false to
 *                        prevent prop update. updates all props by default
 */
export default function updateObject(target, source, shouldUpdate = noop) {
  for (const prop in source) {
    if (!source.hasOwnProperty(prop)) {
      // ignore prototype props
      continue;
    }

    /** @type {*} */ const targetValue = target[prop];
    /** @type {*} */ const sourceValue = source[prop];

    if (shouldUpdate(prop, targetValue, sourceValue) === false) {
      // ignore due to custom handler
      continue;
    }

    // do not allow creating new props in target
    if (!target.hasOwnProperty(prop)) {
      throw Error(`Target object does not have property '${prop}' to update`);
    }

    // check types

    // hack-fix js types
    const getType = val =>
      val === null ? "null" : Array.isArray(val) ? "array" : typeof val;

    const targetType = getType(targetValue);
    const sourceType = getType(sourceValue);

    // allow to initialize target properties (undefined)
    // allow to change previously cleaned props (null)
    // allow to clean target properties (null)
    // do not allow changing target types
    if (
      targetValue !== undefined &&
      targetValue !== null &&
      sourceValue !== null &&
      targetType !== sourceType
    ) {
      throw Error(
        `Target prop '${prop}' has type '${targetType}', ` +
          `but source has type '${sourceType}'`
      );
    }

    // apply update
    if (targetType === "array" && sourceType === "array") {
      // do not allow changing type of array items
      if (targetValue.length && sourceValue.length) {
        const targetItemValue = targetValue[0];
        const sourceItemValue = sourceValue[0];

        const targetItemType = typeof targetItemValue;
        const sourceItemType = typeof sourceItemValue;

        // check data type
        if (targetItemType !== sourceItemType) {
          throw Error(
            `Items of target array '${prop}' has type ` +
              `'${targetItemType}', but items of source array ` +
              `has type '${sourceItemType}'`
          );
        }

        // check constructor of object items
        if (
          targetItemType === "object" &&
          sourceItemType === "object" &&
          targetItemValue.constructor !== sourceItemValue.constructor
        ) {
          throw Error(
            `Objects of target array '${prop}' were constructed ` +
              `by '${targetItemValue.constructor.name}', but ` +
              `objects of source array constructed by ` +
              `'${sourceItemValue.constructor.name}'`
          );
        }
      }

      // replace array
      target[prop] = sourceValue;
    } else if (targetType === "object" && sourceType === "object") {
      // check object constructor.
      // allow source constructor to be genenic object (simple patch).
      if (
        sourceValue.constructor !== Object &&
        targetValue.constructor !== sourceValue.constructor
      ) {
        throw Error(
          `Target prop '${prop}' has object constructed by ` +
            `'${targetValue.constructor.name}', but source object ` +
            `constructed by '${sourceValue.constructor.name}'`
        );
      }

      if (sourceValue.constructor === Object) {
        // source object is generic object (simple patch).
        // deep update props of target nested object
        updateObject(targetValue, sourceValue, shouldUpdate);
      } else {
        // source object is class instance.
        // replace nested object
        target[prop] = sourceValue;
      }
    } else {
      target[prop] = sourceValue;
    }
  }
}
