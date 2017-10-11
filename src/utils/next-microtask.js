/**
 * Schedules next js-queue microtask (job)
 * 
 * @example
 * await nextMicrotask();
 * // code here will run in next microtask
 * 
 * @return {Promise}
 */
export default function nextMicrotask() {
    return Promise.resolve();
}