/**
 * Throws error if boolean expression is falsy
 *
 * Q: why not use default nodejs 'assert'?
 * A: because default assert throws custom error (AssertionError)
 *    which get logged in console without complete stacktrace (async).
 *    probably issue with sourcemapping of custom errors in chrome v61.
 *
 * @param {*} bool
 * @param {*} errorMessage
 */
export default function assert(bool, errorMessage) {
  if (!bool) {
    throw Error(errorMessage);
  }
}
