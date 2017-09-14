/**
 * Deletes undefined props from object
 * @param {object} obj
 */
export default function deleteUndefinedProps(obj) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === undefined) {
                delete obj[prop];
            }
        }
    }
}