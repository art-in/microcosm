import {expect} from 'test/utils';
import {spy} from 'sinon';

import combineHandlerPatches from 'test/utils/combine-handler-patches';

import State from 'src/boot/client/State';
import MainVM from 'src/vm/main/Main';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('init', () => {

    it('should init data state', async () => {

        // setup
        const state = new State();
        const dispatch = () => {};
        const mutate = spy();

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                storeDispatch: () => {},
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
        const dispatch = () => {};
        const mutate = spy();

        // target
        const patch = await handle(state, {
            type: 'init',
            data: {
                storeDispatch: () => {},
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
        const dispatch = () => {};
        const mutate = spy();
        const storeDispatch = () => {};

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

});