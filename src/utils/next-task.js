import timer from './timer';

/**
 * Schedules next js-queue task (macrotask)
 * 
 * @example
 * await nextTask();
 * // code here will run in microtask which follows next task
 * 
 * @return {Promise}
 */
export default function nextTask() {
    return timer(0);
}