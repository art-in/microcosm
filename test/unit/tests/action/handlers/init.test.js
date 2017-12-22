import {expect} from 'test/utils';
import {spy, stub} from 'sinon';
import noop from 'src/utils/noop';

import combineHandlerPatches from 'test/utils/combine-handler-patches';

import State from 'src/boot/client/State';
import MainVM from 'src/vm/main/Main';
import ConnectionState from 'src/action/utils/ConnectionState';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('init', () => {

    /** @type {sinon.SinonStub} */
    let fetchStub;

    /** @type {sinon.SinonStub} */
    let setTimeoutStub;

    before(() => {
        fetchStub = stub(window, 'fetch');

        // stub timeout so heartbeat checks are not initiated after test is done
        setTimeoutStub = stub(window, 'setTimeout');
    });

    beforeEach(() => {
        fetchStub.reset();
    });

    after(() => {
        fetchStub.restore();
        setTimeoutStub.restore();
    });

    it('should init data state', async () => {

        // setup
        const state = new State();
        const dispatch = noop;
        const mutate = spy();

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                storeDispatch: noop,
                dbServerUrl: 'TEST_DB_SERVER',
                viewRoot: document.createElement('div')
            }
        }, dispatch, mutate);

        // check
        const mutations = combineHandlerPatches(mutate, patch)['init'];

        expect(mutations).to.have.length(1);
        const mutationData = mutations[0].data;

        expect(mutationData.data.dbServerUrl).to.equal('TEST_DB_SERVER');
    });

    it('should init view model state', async () => {

        // setup
        const state = new State();
        const dispatch = noop;
        const mutate = spy();

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                storeDispatch: noop,
                dbServerUrl: 'TEST_DB_SERVER',
                viewRoot: document.createElement('div')
            }
        }, dispatch, mutate);

        // check
        const mutations = combineHandlerPatches(mutate, patch)['init'];

        expect(mutations).to.have.length(1);
        const mutationData = mutations[0].data;

        expect(mutationData.vm.main).to.be.instanceOf(MainVM);
    });

    it('should init view state', async () => {
        
        // setup
        const state = new State();
        const dispatch = noop;
        const mutate = spy();
        const storeDispatch = noop;

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                storeDispatch,
                dbServerUrl: 'TEST_DB_SERVER',
                viewRoot: document.createElement('div')
            }
        }, dispatch, mutate);

        // check
        const mutations = combineHandlerPatches(mutate, patch)['init'];

        expect(mutations).to.have.length(1);
        const mutationData = mutations[0].data;

        expect(mutationData.view.root).to.be.instanceOf(HTMLElement);
        expect(mutationData.view.storeDispatch).to.equal(storeDispatch);
    });

    it('should start db server heartbeat checks', async () => {

        // setup
        const state = new State();
        const dispatch = noop;
        const mutate = noop;
        const storeDispatch = noop;

        // target
        await handle(state, {
            type: 'init',
            data: {
                storeDispatch,
                dbServerUrl: 'TEST_DB_SERVER',
                viewRoot: document.createElement('div')
            }
        }, dispatch, mutate);

        // check
        expect(fetchStub.callCount).to.equal(1);
        expect(fetchStub.firstCall.args[0]).to.equal('TEST_DB_SERVER');
    });

    it('should dispatch action on db server connection change', async () => {
        
        // setup
        const state = new State();
        const dispatch = noop;
        const mutate = noop;
        const storeDispatch = spy();

        // target
        await handle(state, {
            type: 'init',
            data: {
                storeDispatch,
                dbServerUrl: 'TEST_DB_SERVER',
                viewRoot: document.createElement('div')
            }
        }, dispatch, mutate);

        // check
        expect(storeDispatch.callCount).to.equal(1);
        expect(storeDispatch.firstCall.args[0]).to.deep.equal({
            type: 'on-db-server-connection-state-change',
            data: {
                connectionState: ConnectionState.disconnected
            }
        });
    });

});