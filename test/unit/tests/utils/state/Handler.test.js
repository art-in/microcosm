import {expect, combinePatches} from 'test/utils';
import {spy} from 'sinon';

import Patch from 'utils/state/Patch';
import Handler from 'utils/state/Handler';

describe('Handler', () => {

    describe('.reg()', () => {

        it('should fail if action already has registered handler', () => {

            // setup
            const handler = new Handler();

            handler.reg('action', () => {});

            // target
            const target = () => handler.reg('action', () => {});

            // check
            expect(target).to.throw(
                'Action \'action\' already has registered handler');
        });

    });

    describe('.handle()', () => {

        it('should call handlers', () => {

            // setup
            const handler = new Handler();

            const handler1 = spy();
            const handler2 = spy();

            handler.reg('action 1', handler1);
            handler.reg('action 2', handler2);

            // target
            handler.handle(
                {state: 1},
                {type: 'action 1', data: 'data'},
                function dispatch() {},
                function mutate() {});

            // check
            expect(handler1.callCount).to.equal(1);
            const call = handler1.getCall(0);
            
            expect(call.args).to.have.length(4);

            expect(call.args[0]).to.deep.equal({state: 1});
            expect(call.args[1]).to.deep.equal('data');
            expect(call.args[2]).to.be.a('function');
            expect(call.args[2].name).to.equal('dispatch');
            expect(call.args[3]).to.be.a('function');
            expect(call.args[3].name).to.equal('validatedMutate');

            expect(handler2.callCount).to.equal(0);
        });

        it('should allow to test intermediate mutations', () => {
            
            // setup
            const handler = new Handler();
            
            handler.reg('action', (state, data, dispatch, mutate) => {
    
                mutate(new Patch({
                    type: 'intermediate mutation 1',
                    data: 1
                }));
    
                mutate(new Patch([{
                    type: 'intermediate mutation 2',
                    data: 2
                }, {
                    type: 'intermediate mutation 3',
                    data: 3
                }]));
    
                return new Patch({
                    type: 'resulting mutation',
                    data: 4
                });
            });
    
            const state = null;
            const dispatch = null;
    
            const mutate = spy();
            
            // target
            const resPatch = handler.handle(
                state,
                {type: 'action'},
                dispatch,
                mutate
            );
    
            // check
            // gather all patches (intermediate + resulting)
            const patches = mutate.getCalls()
                .map(c => c.args[0])
                .concat(resPatch);
            
            // check patches count
            expect(patches).to.have.length(3);
    
            // check each individual patches
            expect(patches[0]).to.have.length(1);
            expect(patches[1]).to.have.length(2);
            expect(patches[2]).to.have.length(1);
    
            // combine mutations to single patch,
            // since it easier to test mutations from single patch
            const patch = combinePatches(mutate, resPatch);
    
            // check mutations count
            expect(patch).to.have.length(4);
    
            // check mutations order
            expect(patch[0].type).to.equal('intermediate mutation 1');
            expect(patch[1].type).to.equal('intermediate mutation 2');
            expect(patch[2].type).to.equal('intermediate mutation 3');
            expect(patch[3].type).to.equal('resulting mutation');
    
            // check mutations existance
            expect(patch['intermediate mutation 1']).to.exist;
            expect(patch['intermediate mutation 2']).to.exist;
            expect(patch['intermediate mutation 3']).to.exist;
            expect(patch['resulting mutation']).to.exist;
    
            // check mutations data
            expect(patch['intermediate mutation 1'][0].data).to.equal(1);
            expect(patch['intermediate mutation 2'][0].data).to.equal(2);
            expect(patch['intermediate mutation 3'][0].data).to.equal(3);
            expect(patch['resulting mutation'][0].data).to.equal(4);
        });

        it('should fail if unknown action', () => {

            // setup
            const handler = new Handler();

            // target
            const result = () => handler.handle({}, {
                type: 'action',
                data: {}
            });

            // check
            expect(result).to.throw(
                'Unknown action type \'action\'');
        });

        describe('sync action handlers', () => {

            it('should return patch', () => {
                
                // setup
                const handler = new Handler();
    
                handler.reg('action', (state, data) => {
                    return new Patch({
                        type: 'mutation',
                        data
                    });
                });
    
                // target
                const patch = handler.handle({state: 1}, {
                    type: 'action',
                    data: 'data'
                });
    
                // check
                expect(patch).to.be.instanceOf(Patch);
                expect(patch).to.have.length(1);
                expect(patch['mutation']).to.exist;
                expect(patch['mutation'][0].data).to.equal('data');
            });

            it('should fail if handler returns invalid patch', () => {
                
                // setup
                const handler = new Handler();
    
                handler.reg('action', (state, data) => 'WRONG VALUE');
    
                // target
                const result = () => handler.handle({}, {
                    type: 'action'
                });
    
                // check
                expect(result).to.throw(
                    `Action handler should return undefined or ` +
                    `instance of a Patch, but returned 'WRONG VALUE'`);
            });
    
            it('should fail if handler passes invalid patch ' +
                'to intermediate mutation', () => {
                
                // setup
                const handler = new Handler();
    
                handler.reg('action', (state, data, dispatch, mutate) =>
                    mutate('WRONG VALUE'));
    
                // target
                const result = () => handler.handle({}, {
                    type: 'action'
                });
    
                // check
                expect(result).to.throw(
                    `Action handler should pass instance of a Patch ` +
                    `as intermediate mutation, but passed 'WRONG VALUE'`);
            });

        });

        describe('async action handlers', () => {

            it('should promise patch', async () => {
                
                // setup
                const handler = new Handler();
    
                handler.reg('action', async (state, data) => {
                    return new Patch({
                        type: 'mutation',
                        data
                    });
                });
    
                // target
                const patch = await handler.handle({state: 1}, {
                    type: 'action',
                    data: 'data'
                });
    
                // check
                expect(patch).to.be.instanceOf(Patch);
                expect(patch).to.have.length(1);
                expect(patch['mutation']).to.exist;
                expect(patch['mutation'][0].data).to.equal('data');
            });

            it('should fail if handler returns invalid patch', async () => {
                
                // setup
                const handler = new Handler();
    
                handler.reg('action', async (state, data) => 'WRONG VALUE');
    
                // target
                const promise = handler.handle({}, {
                    type: 'action'
                });
    
                // check
                await expect(promise).to.be.rejectedWith(
                    `Action handler should return undefined or ` +
                    `instance of a Patch, but returned 'WRONG VALUE'`);
            });

            it('should fail if handler passes invalid patch ' +
                'to intermediate mutation', async () => {
                
                // setup
                const handler = new Handler();

                handler.reg('action', async (state, data, dispatch, mutate) => {
                    mutate('WRONG VALUE');
                });

                // target
                const promise = handler.handle({}, {
                    type: 'action'
                });

                // check
                await expect(promise).to.be.rejectedWith(
                    `Action handler should pass instance of a Patch ` +
                    `as intermediate mutation, but passed 'WRONG VALUE'`);
            });

        });

    });

    describe('.combine()', () => {

        it('should combine handlers', () => {

            // setup
            const handler1 = new Handler();
            const handler2 = new Handler();

            const handlerFunc1 = spy();
            const handlerFunc2 = spy();

            handler1.reg('action 1', handlerFunc1);
            handler2.reg('action 2', handlerFunc2);

            // target
            const result = Handler.combine(handler1, handler2);

            // check
            result.handle(null, {type: 'action 2'});

            expect(handlerFunc1.callCount).to.equal(0);
            expect(handlerFunc2.callCount).to.equal(1);
        });

        it('should consume handler arrays', () => {
            
            // setup
            const handler1 = new Handler();
            const handler2 = new Handler();

            const handlerFunc1 = spy();
            const handlerFunc2 = spy();

            handler1.reg('action 1', handlerFunc1);
            handler2.reg('action 2', handlerFunc2);

            // target
            const result = Handler.combine([handler1, handler2]);

            // check
            result.handle(null, {type: 'action 2'});

            expect(handlerFunc1.callCount).to.equal(0);
            expect(handlerFunc2.callCount).to.equal(1);
        });

    });

});