/**
 * Deletes undefined props from object
 * @param {Object.<string, *>} obj
 */
export default function deleteUndefinedProps(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (obj[prop] === undefined) {
        delete obj[prop];
      }
    }
  }
}
