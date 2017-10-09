import {expect} from 'test/utils';
import {spy} from 'sinon';

import Patch from 'utils/state/Patch';
import Dispatcher from 'utils/state/Dispatcher';

describe('Dispatcher', () => {

    describe('.reg()', () => {

        it('should fail if action already has handler', () => {

            // setup
            const disp = new Dispatcher();

            disp.reg('action', () => {});

            // target
            const target = () => disp.reg('action', () => {});

            // check
            expect(target).to.throw(
                'Action \'action\' already has registered handler');
        });

    });

    describe('.dispatch()', () => {

        it('should call dispatchers', () => {

            // setup
            const disp = new Dispatcher();

            const handler1 = spy();
            const handler2 = spy();

            disp.reg('action 1', handler1);
            disp.reg('action 2', handler2);

            // target
            disp.dispatch({state: 1}, {
                type: 'action 1',
                data: 'data'
            });

            // check
            expect(handler1.callCount).to.equal(1);
            expect(handler1.getCall(0).args[0]).to.deep.equal({state: 1});
            expect(handler1.getCall(0).args[1]).to.deep.equal('data');
            expect(handler1.getCall(0).args[2]).to.be.a('function');
            expect(handler2.callCount).to.equal(0);
        });

        it('should return patch', async () => {

            // setup
            const disp = new Dispatcher();

            disp.reg('action', (state, data) => {
                return new Patch({
                    type: 'mutation',
                    data
                });
            });

            // target
            const patch = await disp.dispatch({state: 1}, {
                type: 'action',
                data: 'data'
            });

            // check
            expect(patch).to.be.instanceOf(Patch);
            expect(patch).to.have.length(1);
            expect(patch['mutation']).to.exist;
            expect(patch['mutation'][0].data).to.equal('data');
        });

        it('should pass action handler to handle child actions', async () => {
            
            // setup
            const disp = new Dispatcher();

            disp.reg('action 1', () => {
                return new Patch({type: 'mutation 1'});
            });

            disp.reg('action 2', async (state, data, handle) => {
                const patch = await handle({type: 'action 1'});
                patch.push({type: 'mutation 2'});
                return patch;
            });

            // target
            const patch = await disp.dispatch({}, {
                type: 'action 2'
            });

            // check
            expect(patch).to.be.instanceOf(Patch);
            expect(patch).to.have.length(2);
            expect(patch['mutation 1']).to.exist;
            expect(patch['mutation 2']).to.exist;
        });

        it('should fail if unknown action', async () => {

            // setup
            const disp = new Dispatcher();

            // target
            const promise = disp.dispatch({}, {
                type: 'action',
                data: {}
            });

            // check
            await expect(promise).to.be.rejectedWith(
                'Unknown action type \'action\'');
        });

        it('should fail if action handler returns invalid patch', async () => {
            
            // setup
            const disp = new Dispatcher();

            disp.reg('action', (state, data) => 'WRONG VALUE');

            // target
            const promise = disp.dispatch({}, {
                type: 'action'
            });

            // check
            await expect(promise).to.be.rejectedWith(
                `Action handler should return undefined or ` +
                `instance of Patch, but returned 'WRONG VALUE'`);
        });

    });

    describe('.combine()', () => {

        it('should combine handlers', () => {

            // setup
            const disp1 = new Dispatcher();
            const disp2 = new Dispatcher();

            const handler1 = spy();
            const handler2 = spy();

            disp1.reg('action 1', handler1);
            disp2.reg('action 2', handler2);

            // target
            const result = Dispatcher.combine(disp1, disp2);

            // check
            result.dispatch(null, {type: 'action 2'});

            expect(handler1.callCount).to.equal(0);
            expect(handler2.callCount).to.equal(1);
        });

    });

});