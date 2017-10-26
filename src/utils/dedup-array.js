/**
 * Returns array without duplicate items
 * 
 * @param {array} array 
 * @return {array}
 */
export default function dedupArray(array) {
    const uniqs = new Set();
    array.forEach(i => uniqs.add(i));
    return Array.from(uniqs);
}