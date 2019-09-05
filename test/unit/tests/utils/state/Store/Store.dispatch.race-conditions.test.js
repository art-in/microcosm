import {expect} from 'chai';
import {timer} from 'test/utils';

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';
import Patch from 'utils/state/Patch';

// here is various situations for investigating race conditions
// while dispatching several actions.
//
// they all fall into three groups of how dispatches were started:
// 1. simultaneously (concurrently, from same task)
// 2. separately (concurrently, from separate tasks)
// 3. sequentially
//
// case #1 (same task) has best chance for race conditions,
// because not only tasks, but also microtasks can race here.
// but running from same task means it was intentionally done from code,
// and that can be easily fixed by awaiting (sequential dispatch #3).
//
// case #2 (separate tasks) is closest for real situations.
// (eg. dispatches initiated by user actions which trigger DOM handlers,
// which are always schedule new tasks).
// only way which lead to race condition here is async mutators, which
// schedule new tasks before applying mutations, forcing handler tasks to race.
// but async mutators is bad practice. action handler should not read from part
// of the state which is served by async mutators.
//
// case #3 (sequence) is bullet proof mechanism to avoid race conditions,
// which should never fail (eg. awaiting child action dispatch from parent
// action handler).

describe('race conditions', () => {
  describe('sync actions / sync mutators', () => {
    it('should NOT race if dispatched simultaneously', async () => {
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
      expect(state.counter).to.equal(2);

      expect(seq).to.deep.equal([
        'handle action (create mutation)',
        'mutate state',
        'handle action (create mutation)',
        'mutate state'
      ]);
    });

    it('should NOT race if dispatched separately', async () => {
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
      // start both actions from separate tasks,
      // same as they would be initiated by user actions
      await Promise.all([
        timer(0).then(() => store.dispatch({type: 'increase counter'})),
        timer(0).then(() => store.dispatch({type: 'increase counter'}))
      ]);

      // check
      expect(state.counter).to.equal(2);

      expect(seq).to.deep.equal([
        'handle action (create mutation)',
        'mutate state',
        'handle action (create mutation)',
        'mutate state'
      ]);
    });

    it('should NOT race if dispatched sequentially', async () => {
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

  describe('async actions / async mutators', () => {
    it('should race if dispatched simultaneously', async () => {
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

      // mutation will not be applied in the same
      // task with create-mutation, since mutator
      // schedules another task before applying change.
      // create-mutation-apply-mutation is not atomic.
      // tasks start to race.
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
      // start both actions from same task.
      // to avoid race, each dispatch should be awaited
      await Promise.all([
        store.dispatch({type: 'increase counter'}),
        store.dispatch({type: 'increase counter'})
      ]);

      // check
      // dispatching twice, but result is one.
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

    it('should race if dispatched separately', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      handler.reg('increase counter 1', async state => {
        seq.push('start handle action 1');
        await timer(0);
        seq.push('end handle action 1 (create mutation)');
        return new Patch({
          type: 'set counter 1',
          data: {counter: state.counter + 1}
        });
      });

      handler.reg('increase counter 2', async state => {
        seq.push('start handle action 2');
        await timer(10);
        seq.push('end handle action 2 (create mutation)');
        return new Patch({
          type: 'set counter 2',
          data: {counter: state.counter + 1}
        });
      });

      // since mutator is async process of applying mutation
      // is broken. create-mutation-apply-mutation is not atomic.
      // tasks start to race.
      const mutator = async (state, patch) => {
        for (const mutation of patch) {
          switch (mutation.type) {
            case 'set counter 1':
              seq.push('start mutate state 1');
              await timer(20);
              seq.push('end mutate state 1 (change state)');
              state.counter = mutation.data.counter;
              break;
            case 'set counter 2':
              seq.push('start mutate state 2');
              await timer(0);
              seq.push('end mutate state 2 (change state)');
              state.counter = mutation.data.counter;
              break;
          }
        }
      };

      const state = {counter: 0};

      const store = new Store(handler, mutator, state);

      // target
      // start both actions from separate tasks,
      // same as they would be initiated by user actions
      await Promise.all([
        timer(0).then(() => store.dispatch({type: 'increase counter 1'})),
        timer(0).then(() => store.dispatch({type: 'increase counter 2'}))
      ]);

      // check
      // called twice but result is one.
      // only way to avoid race is to make mutators sync.
      expect(state.counter).to.equal(1);

      expect(seq).to.deep.equal([
        'start handle action 1',
        'start handle action 2',
        'end handle action 1 (create mutation)',
        'start mutate state 1',
        'end handle action 2 (create mutation)', // (!)
        'start mutate state 2',
        'end mutate state 2 (change state)',
        'end mutate state 1 (change state)'
      ]);
    });

    it('should NOT race if dispatched sequentially', async () => {
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

  describe('async actions / sync mutators', () => {
    it('should race if dispatched simultaneously', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      // action handler schedules microtask, so
      // microtasks of both handlers started from same task
      // will start to race
      handler.reg('increase counter', async state => {
        seq.push('start handle action');
        await 0;
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
      // dispatched twice but result is one
      expect(state.counter).to.equal(1);

      expect(seq).to.deep.equal([
        'start handle action',
        'start handle action',
        'end handle action (create mutation)', // read before write
        'end handle action (create mutation)',
        'mutate state',
        'mutate state'
      ]);
    });

    it('should NOT race if dispatched separately', async () => {
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
      // start both actions from separate tasks,
      // same as they would be initiated by user actions
      await Promise.all([
        timer(0).then(() => store.dispatch({type: 'increase counter'})),
        timer(0).then(() => store.dispatch({type: 'increase counter'}))
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

    it('should NOT race if dispatched sequentially', async () => {
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
      // start both actions sequentially
      await store.dispatch({type: 'increase counter'});
      await store.dispatch({type: 'increase counter'});

      // check
      expect(state.counter).to.equal(2);

      expect(seq).to.deep.equal([
        'start handle action',
        'end handle action (create mutation)',
        'mutate state',
        'start handle action',
        'end handle action (create mutation)',
        'mutate state'
      ]);
    });
  });

  describe('child actions', () => {
    it('should race if dispatched simultaneously', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      handler.reg(
        'decrease counter - parent',
        async (state, data, dispatch) => {
          seq.push('start handle parent action');
          await dispatch({type: 'increase counter - child'});
          seq.push('end handle parent action (create mutation)');
          return new Patch({
            type: 'set counter',
            data: {counter: state.counter - 1}
          });
        }
      );

      handler.reg('increase counter - child', state => {
        seq.push('handle child action (create mutation)');
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
        store.dispatch({type: 'decrease counter - parent'}),
        store.dispatch({type: 'decrease counter - parent'})
      ]);

      // check
      // two rounds should lead to zero but got one
      expect(state.counter).to.equal(1);

      expect(seq).to.deep.equal([
        'start handle parent action',
        'handle child action (create mutation)',
        'mutate state',
        'start handle parent action',
        'handle child action (create mutation)',
        'mutate state',
        'end handle parent action (create mutation)', // (!)
        'end handle parent action (create mutation)',
        'mutate state',
        'mutate state'
      ]);
    });

    it('should NOT race if dispatched separately', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      handler.reg(
        'decrease counter - parent',
        async (state, data, dispatch) => {
          seq.push('start handle parent action');
          await dispatch({type: 'increase counter - child'});
          seq.push('end handle parent action (create mutation)');
          return new Patch({
            type: 'set counter',
            data: {counter: state.counter - 1}
          });
        }
      );

      handler.reg('increase counter - child', state => {
        seq.push('handle child action (create mutation)');
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
      // start both actions from separate tasks,
      // same as they would be initiated by user actions
      await Promise.all([
        timer(0).then(() =>
          store.dispatch({type: 'decrease counter - parent'})
        ),
        timer(0).then(() => store.dispatch({type: 'decrease counter - parent'}))
      ]);

      // check
      expect(state.counter).to.equal(0);

      expect(seq).to.deep.equal([
        'start handle parent action',
        'handle child action (create mutation)',
        'mutate state',
        'end handle parent action (create mutation)',
        'mutate state',
        'start handle parent action',
        'handle child action (create mutation)',
        'mutate state',
        'end handle parent action (create mutation)',
        'mutate state'
      ]);
    });

    it('should NOT race if dispatched sequentially', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      handler.reg(
        'increase counter - parent',
        async (state, data, dispatch) => {
          seq.push('start handle parent action');
          await dispatch({type: 'increase counter - child'});
          seq.push('end handle parent action (create mutation)');
          return new Patch({
            type: 'set counter - parent',
            data: {parentCounter: state.childCounter}
          });
        }
      );

      handler.reg('increase counter - child', state => {
        seq.push('handle child action (create mutation)');
        return new Patch({
          type: 'set counter - child',
          data: {childCounter: state.childCounter + 1}
        });
      });

      const mutator = (state, patch) => {
        for (const mutation of patch) {
          switch (mutation.type) {
            case 'set counter - parent':
              seq.push('mutate parent state');
              state.parentCounter = mutation.data.parentCounter;
              break;
            case 'set counter - child':
              seq.push('mutate child state');
              state.childCounter = mutation.data.childCounter;
              break;
          }
        }
      };

      const state = {childCounter: 0, parentCounter: 0};

      const store = new Store(handler, mutator, state);

      // target
      // start both actions sequentially
      await store.dispatch({type: 'increase counter - parent'});
      await store.dispatch({type: 'increase counter - parent'});

      // check
      expect(state.childCounter).to.equal(2);
      expect(state.parentCounter).to.equal(2);

      expect(seq).to.deep.equal([
        'start handle parent action',
        'handle child action (create mutation)',
        'mutate child state',
        'end handle parent action (create mutation)',
        'mutate parent state',

        'start handle parent action',
        'handle child action (create mutation)',
        'mutate child state',
        'end handle parent action (create mutation)',
        'mutate parent state'
      ]);
    });
  });

  describe('intermediate mutations', () => {
    it('should race if dispatched simultaneously', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      // dispatch forced to await async handler to get patch,
      // but since it does not schedule separate task and
      // resolves in current one - two competing handlers
      // create microtasks which start to race.
      handler.reg('increase counter', async (state, data, dispatch, mutate) => {
        seq.push('start handle action (create inter mutation)');
        mutate(
          new Patch({
            type: 'set counter',
            data: {counter: state.counter + 1}
          })
        );

        // scheduling next microtask does not help
        await Promise.resolve();

        // to avoid race, async handler should
        // 1 - schedule real task before returning patch
        // 2 - make intermediate mutation instead of resulting
        // 3 - remove unnecessary async tag

        seq.push('end handle action (create result mutation)');
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
      // start both actions simultaneously.
      // to avoid race, each dispatch should be awaited
      await Promise.all([
        store.dispatch({type: 'increase counter'}),
        store.dispatch({type: 'increase counter'})
      ]);

      // check
      // result should be four but it is three.
      expect(state.counter).to.equal(3);

      expect(seq).to.deep.equal([
        'start handle action (create inter mutation)',
        'mutate state',
        'start handle action (create inter mutation)',
        'mutate state',
        'end handle action (create result mutation)',
        'end handle action (create result mutation)',
        'mutate state',
        'mutate state'
      ]);
    });

    it('should NOT race if sends intermediate mutations', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      handler.reg('increase counter', async (state, data, dispatch, mutate) => {
        seq.push('start handle action (create mutation)');
        mutate(
          new Patch({
            type: 'set counter',
            data: {counter: state.counter + 1}
          })
        );

        seq.push('end handle action (create mutation)');
        mutate(
          new Patch({
            type: 'set counter',
            data: {counter: state.counter + 1}
          })
        );
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
      expect(state.counter).to.equal(4);

      expect(seq).to.deep.equal([
        'start handle action (create mutation)',
        'mutate state',
        'end handle action (create mutation)',
        'mutate state',
        'start handle action (create mutation)',
        'mutate state',
        'end handle action (create mutation)',
        'mutate state'
      ]);
    });

    it('should NOT race if dispatched separately', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      handler.reg('increase counter', async (state, data, dispatch, mutate) => {
        seq.push('start handle action (create inter mutation)');
        mutate(
          new Patch({
            type: 'set counter',
            data: {counter: state.counter + 1}
          })
        );

        await Promise.resolve();

        seq.push('end handle action (create result mutation)');
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
      // start both actions from separate tasks,
      // same as they would be initiated by user actions
      await Promise.all([
        timer(0).then(() => store.dispatch({type: 'increase counter'})),
        timer(0).then(() => store.dispatch({type: 'increase counter'}))
      ]);

      // check
      expect(state.counter).to.equal(4);

      expect(seq).to.deep.equal([
        'start handle action (create inter mutation)',
        'mutate state',
        'end handle action (create result mutation)',
        'mutate state',

        'start handle action (create inter mutation)',
        'mutate state',
        'end handle action (create result mutation)',
        'mutate state'
      ]);
    });

    it('should NOT race if dispatched sequentially', async () => {
      // setup
      const seq = [];
      const handler = new Handler();

      handler.reg('increase counter', async (state, data, dispatch, mutate) => {
        seq.push('start handle action (create inter mutation)');
        mutate(
          new Patch({
            type: 'set counter',
            data: {counter: state.counter + 1}
          })
        );

        await Promise.resolve();

        seq.push('end handle action (create result mutation)');
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
      // start both actions sequentially
      await store.dispatch({type: 'increase counter'});
      await store.dispatch({type: 'increase counter'});

      // check
      expect(state.counter).to.equal(4);

      expect(seq).to.deep.equal([
        'start handle action (create inter mutation)',
        'mutate state',
        'end handle action (create result mutation)',
        'mutate state',

        'start handle action (create inter mutation)',
        'mutate state',
        'end handle action (create result mutation)',
        'mutate state'
      ]);
    });
  });
});
