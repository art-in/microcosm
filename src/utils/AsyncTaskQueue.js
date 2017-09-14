/**
 * Executes async tasks sequentially
 * 
 * Use case?
 * Async tasks executed by series of sync sub-tasks (steps in js task queue).
 * When async tasks called in parallel, their sub-tasks can mix up, which
 * is usually OK, because it improves performance.
 * But sometimes unacceptable: eg. get/insert ops in DB.
 * To ensure certain series of async tasks are executed atomicaly
 * (ie. sub-tasks are not mixed up), we should maintain our own 
 * task queue for them.
 */
export default class AsyncTaskQueue {
    
    _tasks = [];

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
     * queue.enqueue(async () => {console.log('A'); await timer(2000)});
     * queue.enqueue(async () => {console.log('B'); await timer(1000)});
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
     * @param {fn} fn - sync or async task
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
     * 
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
        const executeNext = () => setTimeout(() => {
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
            result
                .then(handleSuccess)
                .catch(handleError);
        } else {
            // handle sync success
            handleSuccess(result);
        }

    }

}