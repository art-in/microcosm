import {expect} from 'chai';
import {spy} from 'sinon';
import clone from 'clone';

import isGuid from 'test/utils/is-guid';
import timer from 'test/utils/timer';

import Store from 'src/utils/state/Store';
import Handler from 'src/utils/state/Handler';
import Patch from 'src/utils/state/Patch';
import Action from 'src/utils/state/Action';

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

        const middleware1 = () => ({onDispatch: events => {
            events.on('before-dispatch', onBeforeDispatch1);
            events.on('after-dispatch', onAfterDispatch1);
            events.on('before-mutation', onBeforeMutation1);
            events.on('after-mutation', onAfterMutation1);
        }});

        const onBeforeDispatch2 = spy();
        const onAfterDispatch2 = spy();
        const onBeforeMutation2 = spy();
        const onAfterMutation2 = spy();

        const middleware2 = () => ({onDispatch: events => {
            events.on('before-dispatch', onBeforeDispatch2);
            events.on('after-dispatch', onAfterDispatch2);
            events.on('before-mutation', onBeforeMutation2);
            events.on('after-mutation', onAfterMutation2);
        }});

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

    it('should call onDispatch on middleware instances', async () => {
    
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
        const middleware = spy(() => ({onDispatch: events => {

            const instNumber = inst.length;
            const log = event => seq.push(`instance ${instNumber}: ${event}`);

            const instance = {
                onBeforeDispatch: spy(() => log('onBeforeDispatch')),
                onAfterDispatch: spy(() => log('onAfterDispatch'))
            };

            events.on('before-dispatch', instance.onBeforeDispatch);
            events.on('after-dispatch', instance.onAfterDispatch);

            inst.push(instance);
        }}));

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
        const mutator = state => state.counter = 2;

        // setup middleware
        const onBeforeDispatch = spy();
        const middleware = () => ({onDispatch: events =>
            events.on('before-dispatch', (...args) =>
                // clone to catch the state at this moment
                onBeforeDispatch(...clone(args)))});

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
        expect(args[0].action).to.be.instanceOf(Action);
        expect(args[0].action).to.containSubset({
            type: 'action',
            data: 'data'
        });
        expect(args[0].state).to.deep.equal({
            counter: 1
        });
    });

    it(`should emit 'after-dispatch' event`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter = 2;

        // setup middleware
        const onAfterDispatch = spy();
        const middleware = () => ({onDispatch: events =>
            events.on('after-dispatch', (...args) =>
                // clone to catch the state at this moment
                onAfterDispatch(...clone(args)))});

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
        expect(args[0].state).to.deep.equal({
            counter: 2
        });
    });

    it(`should emit 'before-handler' event`, async () => {

        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter = 2;

        // setup middleware
        const onBeforeHandler = spy();
        const middleware = () => ({onDispatch: events =>
            events.on('before-handler', (...args) =>
                // clone to catch the state at this moment
                onBeforeHandler(...clone(args)))});

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
        expect(onBeforeHandler.callCount).to.equal(1);
        
        const args = onBeforeHandler.firstCall.args;
        expect(args).to.have.length(1);

        // check action
        expect(args[0].action).to.be.instanceOf(Action);
        expect(args[0].action).to.containSubset({
            type: 'action',
            data: 'data'
        });
        expect(args[0].state).to.deep.equal({
            counter: 1
        });
    });
        
    it(`should emit 'after-handler' event`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter = 2;

        // setup middleware
        const onAfterHandler = spy();
        const middleware = () => ({onDispatch: events =>
            events.on('after-handler', (...args) =>
                // clone to catch the state at this moment
                onAfterHandler(...clone(args)))});

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
        expect(onAfterHandler.callCount).to.equal(1);

        const args = onAfterHandler.firstCall.args;
        expect(args).to.have.length(1);

        // check patch
        expect(args[0].state).to.deep.equal({
            counter: 1
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
        const middleware = () => ({onDispatch: events =>
            events.on('before-mutation', (...args) =>
                // clone to catch the state at this moment
                onBeforeMutation(...clone(args)))});
        
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
        expect(isGuid(args[0].mutationId)).to.be.true;
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
        const middleware = () => ({onDispatch: events =>
            events.on('after-mutation', (...args) =>
                // clone to catch the state at this moment
                onAfterMutate(...clone(args)))});

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
            state: {counter: 2}
        });
        expect(isGuid(args[0].mutationId)).to.be.true;
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
        const middleware = () => ({onDispatch: events =>
            events.on('before-mutation', (...args) =>
                // clone to catch the state at this moment
                onBeforeMutation(...clone(args)))});
        
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
        expect(isGuid(firstCallArgs.mutationId)).to.be.true;

        expect(secondCallArgs).to.containSubset({
            patch: {mutations: [{type: 'mutation'}]},
            state: {counter: 1}
        });
        expect(isGuid(secondCallArgs.mutationId)).to.be.true;
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
        const middleware = () => ({onDispatch: events =>
            events.on('after-mutation', (...args) =>
                // clone to catch the state at this moment
                onAfterMutation(...clone(args)))});
        
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
        expect(isGuid(firstCallArgs.mutationId)).to.be.true;

        expect(secondCallArgs).to.containSubset({
            state: {counter: 2}
        });
        expect(isGuid(secondCallArgs.mutationId)).to.be.true;
    });

    it(`should emit 'mutation' events with unique mutation IDs`, async () => {
        
        // setup
        const handler = new Handler();
        handler.reg('action', async (_, __, ___, mutate) => {

            // start both mutations concurrently
            await Promise.all([
                mutate(new Patch({type: 'mutation'})),
                mutate(new Patch({type: 'mutation'}))
            ]);
        });

        const state = {};
        const mutator = async state => {
            // make async mutator so both mutations are intersected
            await timer(0);
        };

        // setup middleware
        const onEvent = spy();
        const middleware = () => ({onDispatch: events => {
            events.on('before-mutation', onEvent.bind(null, 'before-mutation'));
            events.on('after-mutation', onEvent.bind(null, 'after-mutation'));
        }});
        
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
        expect(onEvent.callCount).to.equal(4);

        const firstCallArgs = onEvent.getCall(0).args;
        const secondCallArgs = onEvent.getCall(1).args;
        const thirdCallArgs = onEvent.getCall(2).args;
        const fourthCallArgs = onEvent.getCall(3).args;

        // events for both mutations are mixed up
        expect(firstCallArgs[0]).to.equal('before-mutation');
        expect(secondCallArgs[0]).to.equal('before-mutation');
        expect(thirdCallArgs[0]).to.equal('after-mutation');
        expect(fourthCallArgs[0]).to.equal('after-mutation');

        // but their mutation IDs still uniquely identify each mutation
        expect(isGuid(firstCallArgs[1].mutationId)).to.be.true;
        expect(isGuid(secondCallArgs[1].mutationId)).to.be.true;

        expect(firstCallArgs[1].mutationId)
            .to.not.equal(secondCallArgs[1].mutationId);

        expect(firstCallArgs[1].mutationId)
            .to.equal(thirdCallArgs[1].mutationId);

        expect(secondCallArgs[1].mutationId)
            .to.equal(fourthCallArgs[1].mutationId);
    });

    it(`should emit 'child-action' for child action dispatches`, async () => {
        
        // setup
        const handler = new Handler();

        handler.reg('parent action',
            async (_, __, dispatch) =>
                void await dispatch({type: 'child action'}));

        handler.reg('child action',
            () => new Patch({type: 'child mutation'}));

        const mutator = () => {};
        const state = {};

        // setup middleware
        const inst = [];
        const middleware = spy(() => ({onDispatch: events => {
            const instance = {onChildAction: spy()};
            events.on('child-action', instance.onChildAction);
            inst.push(instance);
        }}));

        // setup store
        const store = new Store(
            handler,
            mutator,
            state,
            [middleware]);
        
        // target
        await store.dispatch({type: 'parent action'});

        // check
        expect(inst).to.have.length(2);

        // parent action dispatches child action
        expect(inst[0].onChildAction.callCount).to.equal(1);

        const childActionCallArgs = inst[0].onChildAction.firstCall.args;
        expect(childActionCallArgs.length).to.equal(1);

        expect(childActionCallArgs[0].action).to.exist;
        expect(childActionCallArgs[0].action.type).to.equal('child action');

        // child action dispatches nothing
        expect(inst[1].onChildAction.callCount).to.equal(0);
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
        const middleware = () => ({onDispatch: events =>
            events.on('handler-fail', onHandlerFail)});

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
        const middleware = () => ({onDispatch: events =>
            events.on('mutation-fail', onMutationFail)});

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
        expect(isGuid(args[0].mutationId)).to.be.true;
    });

});