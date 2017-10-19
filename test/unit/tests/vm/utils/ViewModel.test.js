import {spy} from 'sinon';
import {expect, timer} from 'test/utils';

import ViewModel from 'src/vm/utils/ViewModel';

describe('ViewModel', () => {

    describe('.emit()', () => {

        it('should execute event handlers (sync)', () => {

            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends ViewModel {
                static eventTypes = [
                    'test-event'
                ];
            }

            const vm = new TestVM();

            const handler = spy();
            vm.on('test-event', handler);

            // target
            vm.emit('test-event');

            // check
            expect(handler.callCount).to.equal(1);
        });

        it('should execute event handlers (async)', async () => {

            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends ViewModel {
                static eventTypes = [
                    'test-event'
                ];
            }

            const vm = new TestVM();

            const handler = spy();
            vm.on('test-event', async () => {
                await timer(0);
                handler();
            });

            // target
            await vm.emit('test-event');

            // check
            expect(handler.callCount).to.equal(1);
        });

    });

});