import {expect} from 'chai';
import {timer} from 'test/utils';

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';
import Patch from 'utils/state/Patch';

describe('race conditions', () => {

    describe('sync actions and sync mutators', () => {

        it('should lead to race condition if dispatched simultaneously',
            async () => {
            
                // setup
                const seq = [];
                const handler = new Handler();
                
                handler.reg('increase counter', state => {
                    seq.push('handle action (create mutation)');
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

                const store = new Store(handler, mutator, state);

                // target
                // start actions simultaneously
                await Promise.all([
                    store.dispatch({type: 'increase counter'}),
                    store.dispatch({type: 'increase counter'})
                ]);

                // check
                // dispatched twice but result is one
                expect(state.counter).to.equal(1);

                expect(seq).to.deep.equal([
                    'handle action (create mutation)',
                    'handle action (create mutation)', // read before write
                    'mutate state',
                    'mutate state'
                ]);
            });

        it('should NOT lead to race condition if dispatched sequentially',
            async () => {
            
                // setup
                const seq = [];
                const handler = new Handler();
                
                handler.reg('increase counter', state => {
                    seq.push('handle action (create mutation)');
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

                const store = new Store(handler, mutator, state);

                // target
                // start actions sequentially
                await store.dispatch({type: 'increase counter'});
                await store.dispatch({type: 'increase counter'});

                // check
                expect(state.counter).to.equal(2);

                expect(seq).to.deep.equal([
                    'handle action (create mutation)',
                    'mutate state',
                    'handle action (create mutation)',
                    'mutate state'
                ]);
            });

    });

    describe('async actions and async mutators', () => {

        it('should lead to race condition if dispatched simultaneously',
            async () => {
                
                // setup
                const seq = [];
                const handler = new Handler();
                
                handler.reg('increase counter', async state => {
                    seq.push('start handle action');
                    await timer(0);
                    seq.push('end handle action (create mutation)');
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
        
                const store = new Store(handler, mutator, state);
        
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
                    'start handle action',
                    'start handle action',
                    'end handle action (create mutation)',
                    'start mutate state',
                    'end handle action (create mutation)', // read before write
                    'start mutate state',
                    'end mutate state (change state)',
                    'end mutate state (change state)'
                ]);
            });

        it('should NOT lead to race condition if dispatched sequentially',
            async () => {
                
                // setup
                const seq = [];
                const handler = new Handler();
                
                handler.reg('increase counter', async state => {
                    seq.push('start handle action');
                    await timer(0);
                    seq.push('end handle action (create mutation)');
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
        
                const store = new Store(handler, mutator, state);
        
                // target
                // start both actions sequentially
                await store.dispatch({type: 'increase counter'});
                await store.dispatch({type: 'increase counter'});
        
                // check
                expect(state.counter).to.equal(2);
        
                expect(seq).to.deep.equal([
                    'start handle action',
                    'end handle action (create mutation)',
                    'start mutate state',
                    'end mutate state (change state)',
                    'start handle action',
                    'end handle action (create mutation)',
                    'start mutate state',
                    'end mutate state (change state)'
                ]);
            });

    });

    describe('async actions and sync mutators', () => {
        
        it('should NOT lead to race condition if dispatched simultaneously',
            async () => {
            
                // setup
                const seq = [];
                const handler = new Handler();
                
                handler.reg('increase counter', async state => {
                    seq.push('start handle action');
                    await timer(0);
                    seq.push('end handle action (create mutation)');
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

                const store = new Store(handler, mutator, state);

                // target
                // start both actions simultaneously
                await Promise.all([
                    store.dispatch({type: 'increase counter'}),
                    store.dispatch({type: 'increase counter'})
                ]);

                // check
                expect(state.counter).to.equal(2);

                expect(seq).to.deep.equal([
                    'start handle action',
                    'start handle action',
                    'end handle action (create mutation)',
                    'mutate state',
                    'end handle action (create mutation)',
                    'mutate state'
                ]);
            });

    });

});