/**
 * Maps props of source object to target object
 * @param {object} target
 * @param {object} source
 * @return {object}
 */
export default function mapObject(target, source) {
    Object.keys(target).forEach(prop => {
        if (typeof source[prop] !== 'undefined') {
            target[prop] = source[prop];
        }
    });

    return target;
}