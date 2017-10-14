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
 */
export default function updateObject(target, source) {

    for (const prop in source) {

        // do not allow creating new props in target
        if (!(prop in target)) {
            throw Error(
                `Target object does not have property '${prop}' to update`);
        }

        // check types
        const targetType = typeof target[prop];
        const sourceType = typeof source[prop];

        // allow to initialize target properties
        // allow to clean target properties
        // do not allow changing target types
        if (target[prop] !== undefined &&
            source[prop] !== null &&
            targetType !== sourceType) {
            throw Error(
                `Target prop '${prop}' has type '${targetType}' ` +
                `but source has type '${sourceType}'`);
        }

        // apply update
        if (typeof target[prop] === 'object' &&
            typeof source[prop] === 'object') {
            
            // deep update
            updateObject(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }

}