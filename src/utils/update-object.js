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

        const targetProp = target[prop];
        const sourceProp = source[prop];

        // check types
        let targetType = typeof targetProp;
        let sourceType = typeof sourceProp;

        // hack-fix js types
        targetType = Array.isArray(targetProp) ? 'array' : targetType;
        sourceType = Array.isArray(sourceProp) ? 'array' : sourceType;

        targetType = targetProp === null ? 'null' : targetType;
        sourceType = sourceProp === null ? 'null' : sourceType;

        // allow to initialize target properties
        // allow to clean target properties
        // do not allow changing target types
        if (targetProp !== undefined &&
            sourceProp !== null &&
            targetType !== sourceType) {
            throw Error(
                `Target prop '${prop}' has type '${targetType}' ` +
                `but source has type '${sourceType}'`);
        }

        // apply update
        if (Array.isArray(targetProp) &&
            Array.isArray(sourceProp)) {
            
            // do not allow changing type of array items 
            if (targetProp.length && sourceProp.length) {
                const targetItemType = typeof targetProp[0];
                const sourceItemType = typeof sourceProp[0];

                if (targetItemType !== sourceItemType) {
                    throw Error(
                        `Items of target array '${prop}' has type ` +
                        `'${targetItemType}' but items of source array ` +
                        `has type '${sourceItemType}'`);
                }
            }
            
            // replace array
            target[prop] = sourceProp;

        } else
        if (typeof targetProp === 'object' &&
            typeof sourceProp === 'object') {
            
            // deep update object
            updateObject(targetProp, sourceProp);
        } else {
            target[prop] = sourceProp;
        }
    }

}