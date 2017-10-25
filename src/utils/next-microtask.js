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
    // awaiting anything will schedule microtask
    // https://github.com/tc39/ecmascript-asyncawait/issues/33
    return 0;
}