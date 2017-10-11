import {expect} from 'chai';
import {spy} from 'sinon';

import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';
import Patch from 'utils/state/Patch';

describe('middlewares', () => {

    it('should call multiple middlewares', async () => {
        
        // setup
        const dispatcher = new Dispatcher();
        dispatcher.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter = 2;

        const onBeforeDispatch1 = spy();
        const onAfterMutate1 = spy();
        const middleware1 = storeEvents => {
            storeEvents.on('before-dispatch', onBeforeDispatch1);
            storeEvents.on('after-mutation', onAfterMutate1);
        };

        const onBeforeDispatch2 = spy();
        const onAfterMutate2 = spy();
        const middleware2 = storeEvents => {
            storeEvents.on('before-dispatch', onBeforeDispatch2);
            storeEvents.on('after-mutation', onAfterMutate2);
        };

        const store = new Store(
            dispatcher,
            mutator,
            state, [
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

    it('should create separate instances for each dispatch', async () => {
        
        // setup
        const seq = [];

        const disp = new Dispatcher();

        disp.reg('parent action',
            async (_, __, dispatch) =>
                void await dispatch({type: 'child action'}));

        disp.reg('child action',
            () => new Patch({type: 'child mutation'}));

        const mutator = () => {};

        const state = {};

        const inst = [];

        const middleware = spy(events => {

            const instNumber = inst.length;
            const log = event => seq.push(`instance ${instNumber}: ${event}`);

            const instance = {
                onBeforeDispatch: spy(() => log('onBeforeDispatch')),
                onDispatchFail: spy(() => log('onDispatchFail')),
                onMutationFail: spy(() => log('onMutationFail')),
                onAfterMutation: spy(() => log('onAfterMutation'))
            };

            events.on('before-dispatch', instance.onBeforeDispatch);
            events.on('dispatch-fail', instance.onDispatchFail);
            events.on('mutation-fail', instance.onMutationFail);
            events.on('after-mutation', instance.onAfterMutation);

            inst.push(instance);
        });

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
            'instance 1: onAfterMutation',
            'instance 0: onAfterMutation'
        ]);

        // parent dispatch
        expect(inst[0].onBeforeDispatch.callCount).to.equal(1);
        expect(inst[0].onDispatchFail.callCount).to.equal(0);
        expect(inst[0].onMutationFail.callCount).to.equal(0);
        expect(inst[0].onAfterMutation.callCount).to.equal(1);

        const firstAction = inst[0].onBeforeDispatch.firstCall.args[0].action;
        const firstPatch = inst[0].onAfterMutation.firstCall.args[0].patch;

        expect(firstAction.type).to.equal('parent action');
        expect(firstPatch.length).to.equal(0);
        
        // child dispatch
        expect(inst[1].onBeforeDispatch.callCount).to.equal(1);
        expect(inst[1].onDispatchFail.callCount).to.equal(0);
        expect(inst[1].onMutationFail.callCount).to.equal(0);
        expect(inst[1].onAfterMutation.callCount).to.equal(1);

        const secondAction = inst[1].onBeforeDispatch.firstCall.args[0].action;
        const secondPatch = inst[1].onAfterMutation.firstCall.args[0].patch;

        expect(secondAction.type).to.equal('child action');
        expect(secondPatch.length).to.equal(1);
        expect(secondPatch[0].type).to.equal('child mutation');
    });

    it(`should emit 'before-dispatch' event`, async () => {

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
            state, [
                middleware
            ]);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(onBeforeDispatch.callCount).to.equal(1);
        
        const args = onBeforeDispatch.firstCall.args;
        expect(args).to.have.length(1);

        // action
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

    it(`should emit 'after-mutation' event`, async () => {
        
        // setup
        const dispatcher = new Dispatcher();
        dispatcher.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = state => state.counter++;

        const onAfterMutate = spy();
        const middleware = storeEvents =>
            storeEvents.on('after-mutation', onAfterMutate);

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
        expect(args).to.have.length(1);

        // patch
        expect(args[0]).to.containSubset({
            patch: {
                mutations: [{
                    data: 'data'
                }]
            },
            state: {
                counter: 2
            }
        });
    });

    it(`should emit 'dispatch-fail' event when dispatch failed`, async () => {
        
        // setup
        const dispatcher = new Dispatcher();
        dispatcher.reg('action', () => {
            throw Error('boom');
        });

        const state = {counter: 1};
        const mutator = () => ({counter: 2});

        const onDispatchFail = spy();
        const middleware = storeEvents =>
            storeEvents.on('dispatch-fail', onDispatchFail);

        const store = new Store(
            dispatcher,
            mutator,
            state, [
                middleware
            ]);

        // target
        const promise = store.dispatch({type: 'action', data: 'data'});
            
        // check
        await expect(promise).to.be.rejectedWith('boom');

        expect(onDispatchFail.callCount).to.equal(1);
        const args = onDispatchFail.firstCall.args;

        expect(args).to.have.length(1);
        expect(args[0]).to.containSubset({
            error: {message: 'boom'}
        });
    });

    it(`should emit 'mutation-fail' event when mutation failed`, async () => {
        
        // setup
        const dispatcher = new Dispatcher();
        dispatcher.reg('action',
            () => new Patch({type: 'mutation', data: 'data'}));

        const state = {counter: 1};
        const mutator = () => {
            throw Error('boom');
        };

        const onMutationFail = spy();
        const middleware = storeEvents =>
            storeEvents.on('mutation-fail', onMutationFail);

        const store = new Store(
            dispatcher,
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
        expect(args[0]).to.containSubset({
            error: {message: 'boom'},
            patch: {
                mutations: [{
                    data: 'data'
                }]
            }
        });
    });

});