/**
 * Creates pure promise object with corresponding resolvers.
 *
 * Helps to perform async work outside promise constructor
 * and so - to NOT add extra indent
 *
 * Case 1 (usual)
 * function() {
 *     return new Promise((resolve, reject) => {
 *         // ... work ... (extra indent)
 *         resolve()
 *     })
 * }
 *
 * Case 2 (with pms)
 * function() {
 *      const {promise, resolve, reject} = pms()
 *
 *      // ... work ... (no extra indents)
 *      resolve()
 *
 *      return promise
 * }
 *
 * WARNING!
 * if 'work' fails - code will fail in current task (sync), and
 * promise will not be rejected.
 * use wisely: try/catch any crucial code and reject returned promise.
 * follow rule: if function returns promise, it should return any
 * result through promise (including errors)
 *
 * @typedef {object} Result
 * @prop {Promise} promise
 * @prop {function} resolve
 * @prop {function} reject
 *
 * @return {Result}
 */
export default function pms() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {promise, resolve, reject};
}
