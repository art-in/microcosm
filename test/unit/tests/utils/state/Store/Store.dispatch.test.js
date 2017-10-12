import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {createState, timer} from 'test/utils';

import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';
import Patch from 'utils/state/Patch';

describe('.dispatch()', () => {

    require('./Store.dispatch.child-actions.test');

    require('./Store.dispatch.intermediate-mutations.test');

    require('./Store.dispatch.middlewares.test');

    require('./Store.dispatch.race-conditions.test');
    
    it('should call dispatcher', async () => {

        // setup
        const dispatcher = new Dispatcher();
        const dispatch = dispatcher.dispatch = spy(dispatcher.dispatch);

        dispatcher.reg('action', () => {});

        const state = createState();
        const mutator = () => state;

        const store = new Store(dispatcher, mutator, state);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.containSubset([
            state,
            {type: 'action', data: 'data'}
        ]);
    });

    it('should call mutator', async () => {

        // setup
        const dispatcher = new Dispatcher();
        const patch = new Patch({type: 'mutation', data: 'data'});
        dispatcher.reg('action', () => patch);

        const state = createState();
        const mutator = stub();
        mutator.returns(state);

        const store = new Store(dispatcher, mutator, state);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(mutator.callCount).to.equal(1);
        expect(mutator.firstCall.args).to.deep.equal([
            state,
            patch
        ]);
    });

    it(`should promise to handle async action and apply async mutation`,
        async () => {

            // setup
            const seq = [];

            let state = {counter: 0};

            const dispatcher = new Dispatcher();
            
            dispatcher.reg('action', async () => {
                seq.push('start dispatch action');
                await timer(0);
                seq.push('end dispatch action');
                return new Patch({type: 'mutation'});
            });

            const mutator = async (state, patch) => {
                for (const mutation of patch) {
                    switch (mutation.type) {
                    case 'mutation':
                        await timer(0);
                        seq.push('apply mutation');
                        state.counter++;
                        break;
                    }
                }
            };

            const store = new Store(dispatcher, mutator, state);

            // target
            state = await store.dispatch({type: 'action'});

            // check
            expect(state.counter).to.equal(1);

            expect(seq).to.deep.equal([
                'start dispatch action',
                'end dispatch action',
                'apply mutation'
            ]);
        });

    it('should promise state', async () => {

        // setup
        const state = {counter: 0};

        const dispatcher = new Dispatcher();
        
        dispatcher.reg('action',
            () => new Patch({type: 'mutation'}));

        const mutator = (state, patch) => {
            for (const mutation of patch) {
                switch (mutation.type) {
                case 'mutation':
                    state.counter++;
                    break;
                }
            }
        };

        const store = new Store(dispatcher, mutator, state);

        // target
        await store.dispatch({type: 'action'});

        // check
        expect(state).to.deep.equal({counter: 1});
    });

});