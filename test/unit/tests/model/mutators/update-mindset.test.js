import {expect} from 'test/utils';

import mutate from 'model/mutators';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindset from 'src/model/entities/Mindset';

describe('update-mindset', () => {
  it('should update mindset', () => {
    // setup
    const mindset = new Mindset({
      id: 'id',
      focusIdeaId: 'abc'
    });

    const state = new State();
    state.model.mindset = mindset;

    const patch = new Patch({
      type: 'update-mindset',
      data: {
        id: 'id',
        focusIdeaId: 'xyz'
      }
    });

    // target
    mutate(state, patch);

    // check
    expect(state.model.mindset).to.containSubset({
      id: 'id',
      focusIdeaId: 'xyz'
    });
  });
});
