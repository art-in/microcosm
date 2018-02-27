/**
 * Wrapper for express async middlewares, which propogates errors to next
 * middleware in the chain (up to express default error handler).
 * Otherwise those errors will quitely stay inside rejected promise (unhandled
 * promise rejection), and request will hang up.
 *
 * Source
 * https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
 *
 * @param {function} fn - async middleware
 * @return {function()} middleware
 */
export default function(fn) {
  return (...args) => fn(...args).catch(args[2]);
}
