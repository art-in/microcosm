import {expect} from 'chai';
import {spy} from 'sinon';
import clone from 'clone';

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';
import Patch from 'utils/state/Patch';

describe('middlewares', () => {

    it('should call multiple middlewares', async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation'}));

        // setup middlewares
        const onBeforeDispatch1 = spy();
        const onAfterDispatch1 = spy();
        const onBeforeMutation1 = spy();
        const onAfterMutation1 = spy();

        const middleware1 = storeEvents => {
            storeEvents.on('before-dispatch', onBeforeDispatch1);
            storeEvents.on('after-dispatch', onAfterDispatch1);
            storeEvents.on('before-mutation', onBeforeMutation1);
            storeEvents.on('after-mutation', onAfterMutation1);
        };

        const onBeforeDispatch2 = spy();
        const onAfterDispatch2 = spy();
        const onBeforeMutation2 = spy();
        const onAfterMutation2 = spy();

        const middleware2 = storeEvents => {
            storeEvents.on('before-dispatch', onBeforeDispatch2);
            storeEvents.on('after-dispatch', onAfterDispatch2);
            storeEvents.on('before-mutation', onBeforeMutation2);
            storeEvents.on('after-mutation', onAfterMutation2);
        };

        // setup store
        const state = {};
        const mutator = () => {};

        const store = new Store(
            handler,
            mutator,
            state, [
                middleware1,
                middleware2
            ]);

        // target
        await store.dispatch({type: 'action'});

        // check
        expect(onBeforeDispatch1.callCount).to.equal(1);
        expect(onAfterDispatch1.callCount).to.equal(1);
        expect(onBeforeMutation1.callCount).to.equal(1);
        expect(onAfterMutation1.callCount).to.equal(1);

        expect(onBeforeDispatch2.callCount).to.equal(1);
        expect(onAfterDispatch2.callCount).to.equal(1);
        expect(onBeforeMutation2.callCount).to.equal(1);
        expect(onAfterMutation2.callCount).to.equal(1);
    });

    it('should create new instances of middlewares', async () => {
    
        // setup
        const seq = [];

        const disp = new Handler();

        disp.reg('parent action',
            async (_, __, dispatch) =>
                void await dispatch({type: 'child action'}));

        disp.reg('child action',
            () => new Patch({type: 'child mutation'}));

        const mutator = () => {};
        const state = {};

        // setup middleware
        const inst = [];
        const middleware = spy(events => {

            const instNumber = inst.length;
            const log = event => seq.push(`instance ${instNumber}: ${event}`);

            const instance = {
                onBeforeDispatch: spy(() => log('onBeforeDispatch')),
                onAfterDispatch: spy(() => log('onAfterDispatch'))
            };

            events.on('before-dispatch', instance.onBeforeDispatch);
            events.on('after-dispatch', instance.onAfterDispatch);

            inst.push(instance);
        });

        // setup store
        const store = new Store(
            disp,
            mutator,
            state,
            [middleware]);
        
        // target
        await store.dispatch({type: 'parent action'});

        // check
        expect(inst).to.have.length(2);

        expect(seq).to.deep.equal([
            'instance 0: onBeforeDispatch',
            'instance 1: onBeforeDispatch',
            'instance 1: onAfterDispatch',
            'instance 0: onAfterDispatch'
        ]);
    });

    it(`should emit 'before-dispatch' event`, async () => {

        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = () => ({counter: 2});

        // setup middleware
        const onBeforeDispatch = spy();
        const middleware = storeEvents =>
            storeEvents.on('before-dispatch', (...args) =>
                // clone to catch the state at this moment
                onBeforeDispatch(...clone(args)));

        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(onBeforeDispatch.callCount).to.equal(1);
        
        const args = onBeforeDispatch.firstCall.args;
        expect(args).to.have.length(1);

        // check action
        expect(args[0]).to.deep.equal({
            action: {
                type: 'action',
                data: 'data'
            },
            state: {
                counter: 1
            }
        });
    });

    it(`should emit 'after-dispatch' event`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter++;

        // setup middleware
        const onAfterDispatch = spy();
        const middleware = storeEvents =>
            storeEvents.on('after-dispatch', (...args) =>
                // clone to catch the state at this moment
                onAfterDispatch(...clone(args)));

        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(onAfterDispatch.callCount).to.equal(1);

        const args = onAfterDispatch.firstCall.args;
        expect(args).to.have.length(1);

        // check patch
        expect(args[0]).to.deep.equal({
            state: {
                counter: 2
            }
        });
    });

    it(`should emit 'before-mutation' for resulting mutation`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter++;

        // setup middleware
        const onBeforeMutation = spy();
        const middleware = storeEvents =>
            storeEvents.on('before-mutation', (...args) =>
                // clone to catch the state at this moment
                onBeforeMutation(...clone(args)));
        
        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(onBeforeMutation.callCount).to.equal(1);

        const args = onBeforeMutation.firstCall.args;
        expect(args).to.have.length(1);

        // check patch
        expect(args[0]).to.containSubset({
            patch: {
                mutations: [{
                    type: 'mutation',
                    data: 'data'
                }]
            },
            state: {
                counter: 1
            }
        });
    });

    it(`should emit 'after-mutation' for resulting mutation`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter++;

        // setup middleware
        const onAfterMutate = spy();
        const middleware = storeEvents =>
            storeEvents.on('after-mutation', (...args) =>
                // clone to catch the state at this moment
                onAfterMutate(...clone(args)));

        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(onAfterMutate.callCount).to.equal(1);

        const args = onAfterMutate.firstCall.args;
        expect(args).to.have.length(1);

        // check patch
        expect(args[0]).to.containSubset({
            state: {
                counter: 2
            }
        });
    });

    it(`should emit 'before-mutation' for intermediate mutations`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action', (_, __, ___, mutate) => {
            mutate(new Patch({type: 'mutation'}));
            mutate(new Patch({type: 'mutation'}));
        });

        const state = {counter: 0};
        const mutator = state => state.counter++;

        // setup middleware
        const onBeforeMutation = spy();
        const middleware = storeEvents =>
            storeEvents.on('before-mutation', (...args) =>
                // clone to catch the state at this moment
                onBeforeMutation(...clone(args)));
        
        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        await store.dispatch({type: 'action'});

        // check
        expect(onBeforeMutation.callCount).to.equal(2);

        const firstCallArgs = onBeforeMutation.firstCall.args[0];
        const secondCallArgs = onBeforeMutation.secondCall.args[0];

        // check calls
        expect(firstCallArgs).to.containSubset({
            patch: {mutations: [{type: 'mutation'}]},
            state: {counter: 0}
        });

        expect(secondCallArgs).to.containSubset({
            patch: {mutations: [{type: 'mutation'}]},
            state: {counter: 1}
        });
    });

    it(`should emit 'after-mutation' for intermediate mutations`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action', (_, __, ___, mutate) => {
            mutate(new Patch({type: 'mutation'}));
            mutate(new Patch({type: 'mutation'}));
        });

        const state = {counter: 0};
        const mutator = state => state.counter++;

        // setup middleware
        const onAfterMutation = spy();
        const middleware = storeEvents =>
            storeEvents.on('after-mutation', (...args) =>
                // clone to catch the state at this moment
                onAfterMutation(...clone(args)));
        
        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        await store.dispatch({type: 'action'});

        // check
        expect(onAfterMutation.callCount).to.equal(2);

        const firstCallArgs = onAfterMutation.firstCall.args[0];
        const secondCallArgs = onAfterMutation.secondCall.args[0];

        // check calls
        expect(firstCallArgs).to.containSubset({
            state: {counter: 1}
        });

        expect(secondCallArgs).to.containSubset({
            state: {counter: 2}
        });
    });

    it(`should emit 'handler-fail' event when handler failed`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action', () => {
            throw Error('boom');
        });

        const state = {counter: 1};
        const mutator = () => ({counter: 2});

        // setup middleware
        const onHandlerFail = spy();
        const middleware = storeEvents =>
            storeEvents.on('handler-fail', onHandlerFail);

        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        const promise = store.dispatch({type: 'action', data: 'data'});
            
        // check
        await expect(promise).to.be.rejectedWith('boom');

        expect(onHandlerFail.callCount).to.equal(1);
        const args = onHandlerFail.firstCall.args;

        expect(args).to.have.length(1);
        expect(args[0]).to.containSubset({
            error: {message: 'boom'}
        });
    });

    it(`should emit 'mutation-fail' event when mutation failed`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = () => {
            throw Error('boom');
        };

        // setup middleware
        const onMutationFail = spy();
        const middleware = storeEvents =>
            storeEvents.on('mutation-fail', onMutationFail);

        // setup store
        const store = new Store(
            handler,
            mutator,
            state, [
                middleware
            ]);

        // target
        const promise = store.dispatch({type: 'action', data: 'data'});
        
        // check
        await expect(promise).to.be.rejectedWith('boom');
        
        expect(onMutationFail.callCount).to.equal(1);
        const args = onMutationFail.firstCall.args;

        expect(args).to.have.length(1);
        expect(args[0]).to.containSubset({error: {message: 'boom'}});
    });

});