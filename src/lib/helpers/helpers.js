/**
 * Creates new random ID
 * @return {string}
 */
export function newIdStr() {
    let arr = new Array(24).fill(0);
    arr = arr.map(() => Math.floor(Math.random() * 10));
    const result = arr.join('');
    return result;
}

/**
 * Generages new GUID
 * @return {string}
 */
export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        // eslint-disable-next-line one-var
        const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * Maps props of source object to target object
 * @param {object} target
 * @param {object} source
 * @return {object}
 */
export function mapObject(target, source) {
    Object.keys(target).forEach(prop => {
        if (typeof source[prop] !== 'undefined') {
            target[prop] = source[prop];
        }
    });

    return target;
}

/**
 * Gets items of array1 which not found in array2
 * @param {array} array1
 * @param {array} array2
 * @return {array}
 */
export function arrDiff(array1, array2) {
    return array1.filter(x => array2.indexOf(x) == -1);
}

/**
 * Gets prop names of obj1 which not found in obj2
 * @param {object} obj1
 * @param {object} obj2
 * @return {array}
 */
export function propDiff(obj1, obj2) {
    return arrDiff(Object.keys(obj1), Object.keys(obj2));
}

/**
 * Deletes props with undefined values from object
 * @param {object} obj
 */
export function deleteUndefinedProps(obj) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === undefined) {
                delete obj[prop];
            }
        }
    }
}

/**
 * Deep clones object (including circular structures)
 * http://stackoverflow.com/a/40293777/1064570
 * @param {object} obj
 * @param {WeekMap} hash
 * @return {object}
 */
export function clone(obj, hash = new WeakMap()) {

    if (Object(obj) !== obj) return obj; // primitives
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    const result = Array.isArray(obj) ? []
        : obj.constructor ? new obj.constructor() : {};
    hash.set(obj, result);
    if (obj instanceof Map) {
        Array.from(obj, ([key, val]) => result.set(key, clone(val, hash)));
    }
    return Object.assign(result, ...Object.keys(obj).map(
        key => ({[key]: clone(obj[key], hash)}) ));
}