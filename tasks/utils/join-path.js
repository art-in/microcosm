const path = require('path');
const slash = require('slash');

/**
 * Creates function which joins path with provided base path.
 * Also normalizes slashes to unix forward-slash.
 *
 * @param {string} base
 * @return {function(string):string} joins path with base
 */
module.exports = base => p => slash(path.join(base, p));
