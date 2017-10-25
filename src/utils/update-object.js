import noop from 'utils/noop';

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
 * @param {object} target 
 * @param {object} source
 * @param {function} [shouldUpdate] - custom prop handler. return false to
 *                        prevent prop update. updates all props by default
 */
export default function updateObject(target, source, shouldUpdate = noop) {

    for (const prop in source) {

        if (!source.hasOwnProperty(prop)) {
            // ignore prototype props
            continue;
        }

        const targetValue = target[prop];
        const sourceValue = source[prop];

        if (shouldUpdate(prop, targetValue, sourceValue) === false) {
            // ignore due to custom handler
            continue;
        }

        // do not allow creating new props in target
        if (!target.hasOwnProperty(prop)) {
            throw Error(
                `Target object does not have property '${prop}' to update`);
        }

        // check types
        let targetType = typeof targetValue;
        let sourceType = typeof sourceValue;

        // hack-fix js types
        targetType = targetValue === null ? 'null' : targetType;
        sourceType = sourceValue === null ? 'null' : sourceType;

        targetType = Array.isArray(targetValue) ? 'array' : targetType;
        sourceType = Array.isArray(sourceValue) ? 'array' : sourceType;

        // allow to initialize target properties (undefined)
        // allow to change previously cleaned props (null)
        // allow to clean target properties (null)
        // do not allow changing target types
        if (targetValue !== undefined &&
            targetValue !== null &&
            sourceValue !== null &&
            targetType !== sourceType) {
            throw Error(
                `Target prop '${prop}' has type '${targetType}' ` +
                `but source has type '${sourceType}'`);
        }

        // apply update
        if (targetType === 'array' &&
            sourceType === 'array') {
            
            // do not allow changing type of array items 
            if (targetValue.length && sourceValue.length) {
                const targetItemType = typeof targetValue[0];
                const sourceItemType = typeof sourceValue[0];

                if (targetItemType !== sourceItemType) {
                    throw Error(
                        `Items of target array '${prop}' has type ` +
                        `'${targetItemType}' but items of source array ` +
                        `has type '${sourceItemType}'`);
                }
            }
            
            // replace array
            target[prop] = sourceValue;

        } else
        if (targetType === 'object' &&
            sourceType === 'object') {
            
            // deep update object
            updateObject(targetValue, sourceValue, shouldUpdate);
        } else {
            target[prop] = sourceValue;
        }
    }

}