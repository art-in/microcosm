import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {createState, timer} from 'test/utils';

import Store from 'src/state/Store';
import Dispatcher from 'src/state/Dispatcher';
import Patch from 'src/state/Patch';

describe('Store', () => {

    describe('.dispatch()', () => {

        it('should call dispatcher', async () => {

            // setup
            const dispatcher = new Dispatcher();
            const dispatch = dispatcher.dispatch = spy();

            const state = createState();
            const mutator = () => state;

            const store = new Store(dispatcher, mutator, state);

            // target
            await store.dispatch('action', {data: 1});

            // check
            expect(dispatch.callCount).to.equal(1);
            expect(dispatch.firstCall.args).to.deep.equal([
                'action',
                {data: 1},
                state
            ]);
        });

        it('should call mutator', async () => {

            // setup
            const dispatcher = new Dispatcher();
            const patch = new Patch('mutation', {data: 1});
            dispatcher.reg('action', () => patch);

            const state = createState();
            const mutator = stub();
            mutator.returns(state);

            const store = new Store(dispatcher, mutator, state);

            // target
            await store.dispatch('action', {data: 1});

            // check
            expect(mutator.callCount).to.equal(1);
            expect(mutator.firstCall.args).to.deep.equal([
                state,
                patch
            ]);
        });

        it('should dispatch async actions sequentially', async () => {

            // setup
            const seq = [];

            let state = {counter: 0};

            const dispatcher = new Dispatcher();
            
            dispatcher.reg('action 1', async () => {
                seq.push('start dispatch action 1');
                await timer(10);
                seq.push('end dispatch action 1');
                return new Patch('mutation 1');
            });

            dispatcher.reg('action 2', async () => {
                seq.push('start dispatch action 2');
                await timer(10);
                seq.push('end dispatch action 2');
                return new Patch('mutation 2');
            });

            const mutator = async (initialState, patch) => {
                for (const mutation of patch) {
                    switch (mutation.type) {
                    case 'mutation 1':
                        seq.push('start mutation 1');
                        await timer(10);
                        seq.push('end mutation 1');
                        return {counter: initialState.counter + 1};
                    case 'mutation 2':
                        seq.push('start mutation 2');
                        await timer(10);
                        seq.push('end mutation 2');
                        return {counter: initialState.counter + 1};
                    }
                }
            };

            const store = new Store(dispatcher, mutator, state);

            // target
            // dispatch both actions in parallel
            store.dispatch('action 1');
            state = await store.dispatch('action 2');

            // check
            expect(state.counter).to.equal(2);

            expect(seq).to.deep.equal([
                'start dispatch action 1',
                'end dispatch action 1',
                'start mutation 1',
                'end mutation 1',

                'start dispatch action 2',
                'end dispatch action 2',
                'start mutation 2',
                'end mutation 2'
            ]);
        });

        it('should return promise with state', async () => {

            // setup
            const state = {counter: 0};

            const dispatcher = new Dispatcher();
            
            dispatcher.reg('action 1', async () => new Patch('mutation 1'));
            dispatcher.reg('action 2', async () => new Patch('mutation 2'));

            const mutator = async (initialState, patch) => {
                for (const mutation of patch) {
                    switch (mutation.type) {
                    case 'mutation 1':
                        return {counter: initialState.counter + 1};
                    case 'mutation 2':
                        return {counter: initialState.counter + 1};
                    }
                }
            };

            const store = new Store(dispatcher, mutator, state);

            // target
            const promise1 = store.dispatch('action 1');
            const promise2 = store.dispatch('action 2');

            await promise2;

            // check
            // versions of state after action 1 and action 2
            const state1 = await promise1;
            const state2 = await promise2;

            expect(state1).to.deep.equal({counter: 1});
            expect(state2).to.deep.equal({counter: 2});
        });

    });

});