import sinon from 'sinon';

import {expect} from 'test/utils';

import EventedViewModel from 'src/vm/utils/EventedViewModel';
import {connect} from 'src/vm/utils/store-connect';
import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';

const mutator = () => {};

describe('connected-vm', () => {

    describe('connect', () => {

        it('should dispatch container actions on vm events', async () => {

            // setup
            const store = new Store(new Dispatcher(), mutator);
            const dispatch = store.dispatch = sinon.spy();

            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = [
                    'event 1',
                    'event 2'
                ]
            }

            connect.to(store);

            // target
            const ConnectedTestVM = connect(dispatch => ({
                ['event 1']: data => dispatch('action 1', data),
                ['event 2']: () => dispatch('action 2')
            }))(TestVM);

            // check
            const vm = new ConnectedTestVM();

            await vm.emit('event 1', {test: 'data'});
            await vm.emit('event 2');
            await vm.emit('event 2');

            expect(dispatch.callCount).to.equal(3);
            expect(dispatch.getCall(0).args)
                .to.deep.equal(['action 1', {test: 'data'}]);
            expect(dispatch.getCall(1).args).to.deep.equal(['action 2']);
            expect(dispatch.getCall(2).args).to.deep.equal(['action 2']);
        });

        it('should connect to store on vm instantiation', () => {

            // setup
            const store1 = new Store(new Dispatcher(), mutator);
            const store2 = new Store(new Dispatcher(), mutator);

            const dispatch1 = store1.dispatch = sinon.spy();
            const dispatch2 = store2.dispatch = sinon.spy();

            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = ['event']
            }

            connect.to(store1);

            // target
            const ConnectedTestVM = connect(dispatch => ({
                ['event']: data => dispatch('action')
            }))(TestVM);

            // check
            connect.to(store2);
            const vm = new ConnectedTestVM();

            vm.emit('event');

            expect(dispatch1.callCount).to.equal(0);
            expect(dispatch2.callCount).to.equal(1);
        });

        it('should connect all vm instances to single store', async () => {

            // setup
            const store = new Store(new Dispatcher(), mutator);
            const dispatch = store.dispatch = sinon.spy();

            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = ['event']
            }

            connect.to(store);

            // target
            const ConnectedTestVM = connect(dispatch => ({
                ['event']: () => dispatch('action')
            }))(TestVM, store);

            // check
            const vm1 = new ConnectedTestVM();
            const vm2 = new ConnectedTestVM();

            await vm1.emit('event');
            await vm2.emit('event');

            expect(dispatch.callCount).to.equal(2);
        });

        it('should allow to connect diff-t stores to diff-t instances', () => {

            // setup
            const store1 = new Store(new Dispatcher(), mutator);
            const store2 = new Store(new Dispatcher(), mutator);

            const dispatch1 = store1.dispatch = sinon.spy();
            const dispatch2 = store2.dispatch = sinon.spy();

            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = [
                    'event 1',
                    'event 2'
                ]
            }

            // target
            const ConnectedTestVM = connect(dispatch => ({
                ['event 1']: data => dispatch('action 1'),
                ['event 2']: data => dispatch('action 2')
            }))(TestVM);

            // check
            connect.to(store1);
            const inst1 = new ConnectedTestVM();

            connect.to(store2);
            const inst2 = new ConnectedTestVM();

            inst1.emit('event 1');
            inst2.emit('event 2');

            expect(dispatch1.callCount).to.equal(1);
            expect(dispatch1.getCall(0).args).to.deep.equal(['action 1']);

            expect(dispatch2.callCount).to.equal(1);
            expect(dispatch2.getCall(0).args).to.deep.equal(['action 2']);
        });

        it('should fail if connecting to unknown event', () => {

            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = ['event']
            }

            // target
            const ConnectedTestVM = connect(dispatch => ({
                ['unknown']: data => dispatch('action')
            }))(TestVM);

            // check
            const target = () => new ConnectedTestVM();

            expect(target).to.throw(
                'No \'unknown\' event to listen on ' +
                '\'TestVM(Connected)\' view model');

        });

        it('should fail if target store not set', () => {

            // setup
            // clear target store
            connect.disconnect();

            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = ['event']
            }

            // target
            const ConnectedTestVM = connect(dispatch => ({
                ['event']: data => dispatch('action')
            }))(TestVM);

            // check
            const target = () => new ConnectedTestVM();

            expect(target).to.throw(
                'VM \'TestVM\' cannot be connected to store, ' +
                'because store was not set (see connect.to(store))');
        });

        it('should fail if event is already has handler', () => {

            // setup
            // eslint-disable-next-line require-jsdoc
            class TestVM extends EventedViewModel {
                static eventTypes = ['event']
            }

            // target
            const ConnectedTestVM = connect(dispatch => ({
                ['event']: data => dispatch('action')
            }))(TestVM);

            // check
            const vm = new ConnectedTestVM();
            const target = () => vm.on('event', () => {});

            expect(target).to.throw(
                '\'TestVM(Connected)\' view model ' +
                'already has handler for \'event\' event');

        });

    });

});