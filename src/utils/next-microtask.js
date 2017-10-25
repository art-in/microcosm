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
    // TODO: not need to create promise,
    //       awaiting anything will schedule microtask
    return Promise.resolve();
}