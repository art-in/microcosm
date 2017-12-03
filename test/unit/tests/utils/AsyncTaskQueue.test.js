import {expect} from 'chai';
import {spy} from 'sinon';

import {timer} from 'test/utils';

import AsyncTaskQueue from 'src/utils/AsyncTaskQueue';

describe('AsyncTaskQueue', () => {

    describe('.enqueue()', () => {

        it('should execute sync tasks sequentially', async () => {
            
            // setup
            const queue = new AsyncTaskQueue();
            const seq = [];

            const task1 = () => seq.push('task 1');
            const task2 = () => seq.push('task 2');
    
            // target
            queue.enqueue(task1);
            await queue.enqueue(task2);

            // check
            expect(seq).to.deep.equal([
                'task 1',
                'task 2'
            ]);
        });

        it('should execute sync tasks separately', async () => {
            
            // setup
            const queue = new AsyncTaskQueue();
            const seq = [];

            const task1 = () => seq.push('task 1');
            const task2 = () => seq.push('task 2');
    
            // target
            queue.enqueue(task1);
            queue.enqueue(task2);

            // check
            // no 'task 2' since it will be called
            // in next event loop step
            expect(seq).to.deep.equal([
                'task 1'
            ]);
        });

        it('should execute async tasks sequentially', async () => {

            // setup
            const queue = new AsyncTaskQueue();
            const seq = [];

            const task1 = async () => {
                seq.push('task 1 start');
                await timer(0);
                seq.push('task 1 end');
            };

            const task2 = async () => {
                seq.push('task 2 start');
                await timer(0);
                seq.push('task 2 end');
            };
    
            // target
            queue.enqueue(task1);
            await queue.enqueue(task2);

            // check
            expect(seq).to.deep.equal([
                'task 1 start',
                'task 1 end',
                'task 2 start',
                'task 2 end'
            ]);

        });

        it('should execute mix of sync and async tasks', async () => {
            
            // setup
            const queue = new AsyncTaskQueue();
            const seq = [];

            const task1 = async () => {
                seq.push('task 1 start');
                await timer(0);
                seq.push('task 1 end');
            };

            const task2 = () => seq.push('task 2');

            const task3 = async () => {
                seq.push('task 3 start');
                await timer(0);
                seq.push('task 3 end');
            };
    
            // target
            queue.enqueue(task1);
            queue.enqueue(task2);
            await queue.enqueue(task3);

            // check
            expect(seq).to.deep.equal([
                'task 1 start',
                'task 1 end',
                'task 2',
                'task 3 start',
                'task 3 end'
            ]);
        });

        it('should return task results', async () => {
            
            // setup
            const queue = new AsyncTaskQueue();
            const seq = [];

            const task1 = async () => {
                seq.push('task 1 start');
                await timer(0);
                seq.push('task 1 end');
                return 1;
            };

            const task2 = async () => {
                seq.push('task 2 start');
                await timer(0);
                seq.push('task 2 end');
                return 2;
            };
    
            // target
            const promise1 = queue.enqueue(task1);
            const promise2 = queue.enqueue(task2);

            // check
            const resultHandler1 = res => seq.push(`task 1 result ${res}`);
            const resultHandler2 = res => seq.push(`task 2 result ${res}`);

            promise1.then(resultHandler1);
            promise2.then(resultHandler2);

            await promise2;

            expect(seq).to.deep.equal([
                'task 1 start',
                'task 1 end',
                'task 1 result 1',
                'task 2 start',
                'task 2 end',
                'task 2 result 2'
            ]);
        });

        it('should return promise', async () => {

            // setup
            const queue = new AsyncTaskQueue();

            const task1 = () => {};
            const task2 = async () => {};

            // target
            const result1 = queue.enqueue(task1);
            const result2 = queue.enqueue(task2);

            // check
            expect(result1).to.be.instanceOf(Promise);
            expect(result2).to.be.instanceOf(Promise);
        });

        it('should reject promises of failed sync tasks', async () => {

            // setup
            const queue = new AsyncTaskQueue();
            
            /* eslint-disable no-undef */
            // @ts-ignore allow run-time throw
            const task1 = async () => NOT_DEFINED_ERROR;
            const task2 = async () => {};
            /* eslint-enable */

            // target
            const promise1 = queue.enqueue(task1);
            const promise2 = queue.enqueue(task2);

            // check
            const promise1ErrorHandler = spy();
            const promise2ResultHandler = spy();

            promise1.catch(promise1ErrorHandler);
            promise2.then(promise2ResultHandler);

            await promise2;

            expect(promise1ErrorHandler.callCount).to.equal(1);
            expect(promise2ResultHandler.callCount).to.equal(1);
        });

        it('should reject promises of failed async tasks', async () => {
            
            // setup
            const queue = new AsyncTaskQueue();


            /* eslint-disable no-undef */
            // @ts-ignore allow run-time throw
            const task1 = async () => NOT_DEFINED_ERROR;
            const task2 = async () => {};
            /* eslint-enable */

            // target
            const promise1 = queue.enqueue(task1);
            const promise2 = queue.enqueue(task2);

            // check
            const promise1ErrorHandler = spy();
            const promise2ResultHandler = spy();

            promise1.catch(promise1ErrorHandler);
            promise2.then(promise2ResultHandler);

            await promise2;

            expect(promise1ErrorHandler.callCount).to.equal(1);
            expect(promise2ResultHandler.callCount).to.equal(1);
        });
    });

});