import {expect} from 'chai';
import {timer} from 'test/utils';

import Store from 'utils/state/Store';
import Handler from 'utils/state/Handler';
import Patch from 'utils/state/Patch';

describe('child actions', () => {
  it(`should pass 'dispatch' function to action handlers`, async () => {
    // setup
    const handler = new Handler();

    // action which postponds increase
    handler.reg('parent action', async (_, __, dispatch) => {
      await timer(0);
      await dispatch({type: 'child action'});
    });

    // action which actually performs increase
    handler.reg(
      'child action',
      state =>
        new Patch({
          type: 'mutation',
          data: {counter: state.counter + 1}
        })
    );

    const state = {counter: 0};
    const mutator = (state, patch) => (state.counter = patch[0].data.counter);

    const store = new Store(handler, mutator, state);

    // target
    await store.dispatch({type: 'parent action'});

    // check
    expect(state.counter).to.equal(1);
  });

  it('should wait child actions', async () => {
    // setup
    const seq = [];

    const handler = new Handler();

    handler.reg('parent action', async (state, data, dispatch) => {
      seq.push('start handle parent action');

      await dispatch({type: 'child action 1'});
      await dispatch({type: 'child action 2'});

      seq.push('end handle parent action');
      return new Patch({
        type: 'parent mutation',
        data: state.childData1 + state.childData2
      });
    });

    handler.reg('child action 1', async () => {
      seq.push('start handle child action 1');
      await timer(0);
      seq.push('end handle child action 1');
      return new Patch({
        type: 'child mutation 1',
        data: 1
      });
    });

    handler.reg('child action 2', async () => {
      seq.push('start handle child action 2');
      await timer(0);
      seq.push('end handle child action 2');
      return new Patch({
        type: 'child mutation 2',
        data: 2
      });
    });

    const mutator = (state, patch) => {
      for (const mutation of patch) {
        switch (mutation.type) {
          case 'child mutation 1':
            seq.push('mutate child 1');
            state.childData1 = mutation.data;
            break;
          case 'child mutation 2':
            seq.push('mutate child 2');
            state.childData2 = mutation.data;
            break;
          case 'parent mutation':
            seq.push('mutate parent');
            state.parentData = mutation.data;
            break;
        }
      }
    };

    const state = {
      childData1: undefined,
      childData2: undefined,
      parentData: undefined
    };

    const store = new Store(handler, mutator, state);

    // target
    await store.dispatch({type: 'parent action'});

    // check
    expect(state.parentData).to.equal(3);

    expect(seq).to.deep.equal([
      'start handle parent action',

      'start handle child action 1',
      'end handle child action 1',
      'mutate child 1',

      'start handle child action 2',
      'end handle child action 2',
      'mutate child 2',

      'end handle parent action',
      'mutate parent'
    ]);
  });
});
