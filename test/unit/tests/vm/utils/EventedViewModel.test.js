import {spy} from 'sinon';
import {expect, timer} from 'test/utils';

import EventedViewModel from 'src/vm/utils/EventedViewModel';

describe('EventedViewModel', () => {

    describe('.emit()', () => {

        it('should execute event handlers (sync)', () => {

            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
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
            class TestVM extends EventedViewModel {
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

        it('should fail on subscribe to unknown event', () => {
            
            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = ['event'];
            }

            const vm = new TestVM();

            // target
            const target = () => vm.on('unknown', spy());

            // check
            expect(target).to.throw(
                'No \'unknown\' event to listen on \'TestVM\' view model');
        });

    });

    describe('.retransmit()', () => {

        it('should re-emit events from another vm', async () => {

            // eslint-disable-next-line require-jsdoc
            class ChildVM extends EventedViewModel {
                static eventTypes = ['test-event'];
            }

            // eslint-disable-next-line require-jsdoc
            class ParentVM extends EventedViewModel {
                static eventTypes = ['test-event'];
                childVM = new ChildVM();
                // eslint-disable-next-line require-jsdoc
                constructor() {
                    super();

                    // target
                    this.retransmit(this.childVM, 'test-event');
                }
            }

            const parentVM = new ParentVM();
            const onParentEvent = spy();
            parentVM.on('test-event', onParentEvent);

            await parentVM.childVM.emit('test-event');

            // check
            expect(onParentEvent.callCount).to.equal(1);
        });

    });

});