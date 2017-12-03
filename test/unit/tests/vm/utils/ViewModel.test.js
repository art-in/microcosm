import {spy, stub} from 'sinon';
import {expect} from 'test/utils';

import ViewModel from 'src/vm/utils/ViewModel';

describe('ViewModel', () => {

    describe('.emit()', () => {

        it('should execute event handlers', () => {

            // setup
            class TestVM extends ViewModel {}

            const vm = new TestVM();

            const handler = spy();
            vm.on('test-event', handler);

            // target
            vm.emit('test-event');

            // check
            expect(handler.callCount).to.equal(1);
        });

        it('should warn if no handler was found', () => {

            // setup
            const consoleWarn = stub(console, 'warn');

            // setup
            class TestVM extends ViewModel {}
            const vm = new TestVM();

            // target
            vm.emit('test-event');

            // check
            expect(consoleWarn.callCount).to.equal(1);
            expect(consoleWarn.firstCall.args[0]).to.equal(
                `Triggering 'test-event' event on 'TestVM' view model, ` +
                `but no one listens to it`);

            // teardown
            consoleWarn.restore();
        });

    });

    describe('.on()', () => {

        it('should fail on duplicate handlers', () => {

            // setup
            class TestVM extends ViewModel {}
            const vm = new TestVM();

            vm.on('test-event', () => {});

            // target
            const target = () => vm.on('test-event', () => {});

            // check
            expect(target).to.throw(
                `'TestVM' view model already has handler for ` +
                `'test-event' event`);
        });

    });

});