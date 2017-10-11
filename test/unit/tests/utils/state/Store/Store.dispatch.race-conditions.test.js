import {expect} from 'chai';
import {timer} from 'test/utils';

import Store from 'utils/state/Store';
import Dispatcher from 'utils/state/Dispatcher';
import Patch from 'utils/state/Patch';

describe('race conditions', () => {

    it('should NOT lead to race condition with sync actions and sync mutators',
        async () => {
        
            // setup
            const seq = [];
            const dispatcher = new Dispatcher();
            
            dispatcher.reg('increase counter', state => {
                seq.push('dispatch action (create mutation)');
                return new Patch({
                    type: 'set counter',
                    data: {counter: state.counter + 1}
                });
            });

            const mutator = (state, patch) => {
                for (const mutation of patch) {
                    switch (mutation.type) {
                    case 'set counter':
                        seq.push('mutate state');
                        state.counter = mutation.data.counter;
                        break;
                    }
                }
            };

            const state = {counter: 0};

            const store = new Store(dispatcher, mutator, state);

            // target
            // start actions simultaneously
            await Promise.all([
                store.dispatch({type: 'increase counter'}),
                store.dispatch({type: 'increase counter'})
            ]);

            // check
            expect(state.counter).to.equal(2);

            expect(seq).to.deep.equal([
                'dispatch action (create mutation)',
                'mutate state',
                'dispatch action (create mutation)',
                'mutate state'
            ]);
        });

    it('should NOT lead to race condition with async actions and sync mutators',
        async () => {
        
            // setup
            const seq = [];
            const dispatcher = new Dispatcher();
            
            dispatcher.reg('increase counter', async state => {
                seq.push('start dispatch action');
                await timer(0);
                seq.push('end dispatch action (create mutation)');
                return new Patch({
                    type: 'set counter',
                    data: {counter: state.counter + 1}
                });
            });

            const mutator = (state, patch) => {
                for (const mutation of patch) {
                    switch (mutation.type) {
                    case 'set counter':
                        seq.push('mutate state');
                        state.counter = mutation.data.counter;
                        break;
                    }
                }
            };

            const state = {counter: 0};

            const store = new Store(dispatcher, mutator, state);

            // target
            // start both actions simultaneously
            await Promise.all([
                store.dispatch({type: 'increase counter'}),
                store.dispatch({type: 'increase counter'})
            ]);

            // check
            expect(state.counter).to.equal(2);

            expect(seq).to.deep.equal([
                'start dispatch action',
                'start dispatch action',
                'end dispatch action (create mutation)',
                'mutate state',
                'end dispatch action (create mutation)',
                'mutate state'
            ]);
        });

    it('should lead to race condition with async mutators', async () => {
        
        // setup
        const seq = [];
        const dispatcher = new Dispatcher();
        
        dispatcher.reg('increase counter', async state => {
            seq.push('start dispatch action');
            await timer(0);
            seq.push('end dispatch action (create mutation)');
            return new Patch({
                type: 'set counter',
                data: {counter: state.counter + 1}
            });
        });

        const mutator = async (state, patch) => {
            for (const mutation of patch) {
                switch (mutation.type) {
                case 'set counter':
                    seq.push('start mutate state');
                    await timer(0);
                    seq.push('end mutate state (change state)');
                    state.counter = mutation.data.counter;
                    break;
                }
            }
        };

        const state = {counter: 0};

        const store = new Store(dispatcher, mutator, state);

        // target
        // start both actions simultaneously
        await Promise.all([
            store.dispatch({type: 'increase counter'}),
            store.dispatch({type: 'increase counter'})
        ]);

        // check
        // dispatching twice, but result is one
        expect(state.counter).to.equal(1);

        expect(seq).to.deep.equal([
            'start dispatch action',
            'start dispatch action',
            'end dispatch action (create mutation)',
            'start mutate state',
            'end dispatch action (create mutation)', // state read before change
            'start mutate state',
            'end mutate state (change state)',
            'end mutate state (change state)'
        ]);
    });

});