import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {createState, timer} from 'test/utils';

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';
import Patch from 'utils/state/Patch';

describe('.dispatch()', () => {

    require('./Store.dispatch.child-actions.test');

    require('./Store.dispatch.intermediate-mutations.test');

    require('./Store.dispatch.middlewares.test');

    require('./Store.dispatch.race-conditions.test');
    
    it('should call handler', async () => {

        // setup
        const handler = new Handler();
        const handle = handler.handle = spy(handler.handle);

        handler.reg('action', () => {});

        const state = createState();
        const mutator = () => state;

        const store = new Store(handler, mutator, state);

        // target
        await store.dispatch({type: 'action', data: 'data'});

        // check
        expect(handle.callCount).to.equal(1);
        expect(handle.firstCall.args).to.containSubset([
            state,
            {type: 'action', data: 'data'}
        ]);
    });

    it('should call mutator', async () => {

        // setup
        const handler = new Handler();
        const patch = new Patch({type: 'mutation', data: 'data'});
        handler.reg('action', () => patch);

        const state = createState();
        const mutator = stub();
        mutator.returns(state);

        const store = new Store(handler, mutator, state);

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

            const handler = new Handler();
            
            handler.reg('action', async () => {
                seq.push('start handle action');
                await timer(0);
                seq.push('end handle action');
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

            const store = new Store(handler, mutator, state);

            // target
            state = await store.dispatch({type: 'action'});

            // check
            expect(state.counter).to.equal(1);

            expect(seq).to.deep.equal([
                'start handle action',
                'end handle action',
                'apply mutation'
            ]);
        });

    it('should promise state', async () => {

        // setup
        const state = {counter: 0};

        const handler = new Handler();
        
        handler.reg('action',
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

        const store = new Store(handler, mutator, state);

        // target
        await store.dispatch({type: 'action'});

        // check
        expect(state).to.deep.equal({counter: 1});
    });

});