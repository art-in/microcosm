/**
 * Queue for executing async tasks sequentially
 *
 * Use case?
 * Both following conditions should meet.
 *
 * 1. Need to execute async tasks atomicaly
 * Async tasks executed by series of sync sub-tasks (steps in js task queue).
 * When async tasks called in parallel, their sub-tasks can mix up, which
 * is usually OK, because improves performance.
 * But sometimes unacceptable: eg. get/insert ops in DB.
 * To ensure certain series of async tasks are executed atomicaly
 * (ie. sub-tasks not mixed up), we should maintain our own
 * task queue for them.
 *
 * 2. Async tasks initiated asynchronously (unpredictably)
 * Ie. we do not know what async tasks we need to execute at once,
 * they initiated in the process (eg. by user actions).
 * Otherwise it's better chain them in sequence with
 * simple 'await's. Same, if we have list of generic async tasks
 * - again, better use simple foreach loop with 'await' inside
 */
export default class AsyncTaskQueue {
  /** @type {Array.<{fn, resolve, reject}>} */
  _tasks = [];

  /** @type {{fn, resolve, reject}?|undefined} */
  _currentTask = null;

  /**
   * Adds task to queue
   *
   * NOTE 1: sync tasks also supported
   * NOTE 2: each task guaranteed to run in separate task queue step
   *
   * @example
   * const queue = new AsyncTaskQueue();
   *
   * queue.enqueue(async () => {await timer(2000); console.log('A')});
   * queue.enqueue(async () => {await timer(1000); console.log('B')});
   * queue.enqueue(() => console.log('C'));
   *
   * // A
   * // B
   * // C
   *
   * @example
   * const queue = new AsyncTaskQueue();
   *
   * const promise1 = queue.enqueue(async () => 'result 1');
   * const promise2 = queue.enqueue(async () => 'result 2');
   *
   * promise1.then(res => console.log); // 'result 1'
   * promise2.then(res => console.log); // 'result 2'
   *
   * @param {function} fn - sync or async task
   * @return {Promise} task result
   */

  enqueue(fn) {
    let resolve;
    let reject;

    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const task = {
      fn,
      resolve,
      reject
    };

    this._tasks.push(task);
    this._executeNext();

    return promise;
  }

  /**
   * Executes next task in queue
   */
  _executeNext() {
    if (this._currentTask || this._tasks.length === 0) {
      // queue is empty or busy
      return;
    }

    this._currentTask = this._tasks.shift();
    let result;

    // handles task execution success
    const handleSuccess = res => {
      this._currentTask.resolve(res);
      executeNext();
    };

    // handles task execution error
    const handleError = err => {
      this._currentTask.reject(err);
      executeNext();
    };

    // schedule execution of next task to next event loop step, so
    // 1. previous async task result handled before next task started
    // 2. sync tasks executed in separate event loop steps
    const executeNext = () =>
      setTimeout(() => {
        this._currentTask = null;
        this._executeNext();
      }, 0);

    try {
      // execute task
      result = this._currentTask.fn();
    } catch (err) {
      // handle sync error
      handleError(err);
      return;
    }

    if (result instanceof Promise) {
      // handle async success and error
      result.then(handleSuccess).catch(handleError);
    } else {
      // handle sync success
      handleSuccess(result);
    }
  }
}
