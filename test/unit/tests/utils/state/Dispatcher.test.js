import sinon from 'sinon';
import {expect} from 'test/utils';

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

            const handler1 = sinon.spy();
            const handler2 = sinon.spy();

            disp.reg('action 1', handler1);
            disp.reg('action 2', handler2);

            // target
            disp.dispatch({state: 1}, {
                type: 'action 1',
                data: 'data'
            });

            // check
            expect(handler1.callCount).to.equal(1);
            expect(handler1.getCall(0).args)
                .to.deep.equal([{state: 1}, 'data']);
            expect(handler2.callCount).to.equal(0);
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

    });

    describe('.combine()', () => {

        it('should combine handlers', () => {

            // setup
            const disp1 = new Dispatcher();
            const disp2 = new Dispatcher();

            const handler1 = sinon.spy();
            const handler2 = sinon.spy();

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