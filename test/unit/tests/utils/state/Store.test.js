import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {createState, timer} from 'test/utils';

import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';
import Patch from 'utils/state/Patch';

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
            await store.dispatch({type: 'action', data: 'data'});

            // check
            expect(dispatch.callCount).to.equal(1);
            expect(dispatch.firstCall.args).to.deep.equal([
                {type: 'action', data: 'data'},
                state
            ]);
        });

        it('should call mutator', async () => {

            // setup
            const dispatcher = new Dispatcher();
            const patch = new Patch({type: 'mutation', data: 'data'});
            dispatcher.reg('action', () => patch);

            const state = createState();
            const mutator = stub();
            mutator.returns(state);

            const store = new Store(dispatcher, mutator, state);

            // target
            await store.dispatch({type: 'action', data: 'data'});

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
                await timer(0);
                seq.push('end dispatch action 1');
                return new Patch({type: 'mutation 1'});
            });

            dispatcher.reg('action 2', async () => {
                seq.push('start dispatch action 2');
                await timer(0);
                seq.push('end dispatch action 2');
                return new Patch({type: 'mutation 2'});
            });

            const mutator = async (initialState, patch) => {
                for (const mutation of patch) {
                    switch (mutation.type) {
                    case 'mutation 1':
                        seq.push('start mutation 1');
                        await timer(0);
                        seq.push('end mutation 1');
                        return {counter: initialState.counter + 1};
                    case 'mutation 2':
                        seq.push('start mutation 2');
                        await timer(0);
                        seq.push('end mutation 2');
                        return {counter: initialState.counter + 1};
                    }
                }
            };

            const store = new Store(dispatcher, mutator, state);

            // target
            // dispatch both actions in parallel
            store.dispatch({type: 'action 1'});
            state = await store.dispatch({type: 'action 2'});

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
            
            dispatcher.reg('action 1',
                async () => new Patch({type: 'mutation 1'}));
            dispatcher.reg('action 2',
                async () => new Patch({type: 'mutation 2'}));

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
            const promise1 = store.dispatch({type: 'action 1'});
            const promise2 = store.dispatch({type: 'action 2'});

            await promise2;

            // check
            // versions of state after action 1 and action 2
            const state1 = await promise1;
            const state2 = await promise2;

            expect(state1).to.deep.equal({counter: 1});
            expect(state2).to.deep.equal({counter: 2});
        });

        it('should call middlewares', async () => {

            // setup
            const dispatcher = new Dispatcher();
            dispatcher.reg('action',
                () => new Patch({type: 'mutation', data: 'data'}));

            const state = {counter: 1};
            const mutator = () => ({counter: 2});

            const onBeforeDispatch1 = spy();
            const onAfterMutate1 = spy();
            const middleware1 = storeEvents => {
                storeEvents.on('before-dispatch', onBeforeDispatch1);
                storeEvents.on('after-mutate', onAfterMutate1);
            };

            const onBeforeDispatch2 = spy();
            const onAfterMutate2 = spy();
            const middleware2 = storeEvents => {
                storeEvents.on('before-dispatch', onBeforeDispatch2);
                storeEvents.on('after-mutate', onAfterMutate2);
            };

            const store = new Store(
                dispatcher,
                mutator,
                state,
                [
                    middleware1,
                    middleware2
                ]);

            // target
            await store.dispatch({type: 'action', data: 'data'});

            // check
            expect(onBeforeDispatch1.callCount).to.equal(1);
            expect(onAfterMutate1.callCount).to.equal(1);

            expect(onBeforeDispatch2.callCount).to.equal(1);
            expect(onAfterMutate2.callCount).to.equal(1);
        });

        it(`should emit 'before-dispatch' event on middlewares`, async () => {

            // setup
            const dispatcher = new Dispatcher();
            dispatcher.reg('action',
                () => new Patch({type: 'mutation', data: 'data'}));

            const state = {counter: 1};
            const mutator = () => ({counter: 2});

            const onBeforeDispatch = spy();
            const middleware = storeEvents =>
                storeEvents.on('before-dispatch', onBeforeDispatch);

            const store = new Store(
                dispatcher,
                mutator,
                state,
                [
                    middleware
                ]);

            // target
            await store.dispatch({type: 'action', data: 'data'});

            // check
            expect(onBeforeDispatch.callCount).to.equal(1);
            
            const args = onBeforeDispatch.firstCall.args;
            expect(args).to.have.length(2);

            // action
            expect(args[0]).to.deep.equal({
                type: 'action',
                data: 'data'
            });
            
            // state
            expect(args[1]).to.deep.equal({
                counter: 1
            });
        });

        it(`should emit 'after-mutate' event on middlewares`, async () => {
            
            // setup
            const dispatcher = new Dispatcher();
            dispatcher.reg('action',
                () => new Patch({type: 'mutation', data: 'data'}));

            const state = {counter: 1};
            const mutator = () => ({counter: 2});

            const onAfterMutate = spy();
            const middleware = storeEvents =>
                storeEvents.on('after-mutate', onAfterMutate);

            const store = new Store(
                dispatcher,
                mutator,
                state, [
                    middleware
                ]);

            // target
            await store.dispatch({type: 'action', data: 'data'});

            // check
            expect(onAfterMutate.callCount).to.equal(1);

            const args = onAfterMutate.firstCall.args;
            expect(args).to.have.length(2);

            // patch
            expect(args[0]).to.containSubset({
                mutations: [{
                    data: 'data'
                }]
            });

            // state
            expect(args[1]).to.deep.equal({
                counter: 2
            });
        });

    });

});