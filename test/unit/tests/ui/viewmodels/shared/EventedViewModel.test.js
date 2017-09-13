import sinon from 'sinon';
import {expect, timer} from 'test/utils';

import EventedViewModel from 'src/ui/viewmodels/shared/EventedViewModel';

describe('EventedViewModel', () => {

    describe('emit', () => {

        it('should execute event handlers (sync)', () => {

            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = [
                    'test-event'
                ];
            }

            const vm = new TestVM();

            const handler = sinon.spy();
            vm.on('test-event', handler);

            // target
            vm.emit('test-event');

            // check
            expect(handler.callCount).to.equal(1);
        });

        it('should execute event handlers (async)', async () => {

            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = [
                    'test-event'
                ];
            }

            const vm = new TestVM();

            const handler = sinon.spy();
            vm.on('test-event', async () => {
                await timer(0);
                handler();
            });

            // target
            await vm.emit('test-event');

            // check
            expect(handler.callCount).to.equal(1);
        });

        it('should fail on subscribe to unknown event', () => {
            
            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = ['event'];
            }

            const vm = new TestVM();

            // target
            const target = () => vm.on('unknown', sinon.spy());

            // check
            expect(target).to.throw(
                'No \'unknown\' event to listen on \'TestVM\' view model');
        });

    });

});