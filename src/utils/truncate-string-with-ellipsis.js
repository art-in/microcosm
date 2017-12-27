const ELLIPSIS = '...';
const ELLIPSIS_LENGTH = ELLIPSIS.length;

/**
 * Truncates string by limit, adding ellipsis to the tail.
 * 
 * Use cases: where CSS `text-overflow: ellipsis` is not possible to use
 *            (eg. for svg 'text').
 * 
 * @param {string} str 
 * @param {number} maxLength 
 * @return {string}
 */
export default function truncateWithEllipsis(str, maxLength) {

    if (maxLength <= ELLIPSIS_LENGTH) {
        throw Error(`Max length '${maxLength}' is too small`);
    }

    if (str.length > maxLength) {
        return str.slice(0, maxLength - ELLIPSIS_LENGTH) + ELLIPSIS;
    }
    
    return str;
}