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
 * Maps props of source object to target object
 * @param {object} target
 * @param {object} source
 */
export function mapObject(target, source) {
    Object.keys(target).forEach(prop => {
        target[prop] = source[prop];
    });
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