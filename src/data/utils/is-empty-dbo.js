/**
 * Checks whether database object has any meaningful data props
 * 
 * @param {Object.<string, *>} dbo
 * @return {boolean}
 */
export default function isEmptyDbo(dbo) {
    const props = Object.getOwnPropertyNames(dbo);

    // id prop always required for 'put' operation
    return props.length === 1 && props[0] === '_id';
}