/**
 * Promise-based timeout
 * @param {number} ms
 * @return {promise}
 */
export default function timer(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
