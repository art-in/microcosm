import {expect} from 'test/utils';

import mutate from 'model/mutators';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindset from 'src/model/entities/Mindset';
import Point from 'src/model/entities/Point';

describe('update-mindset', () => {
  it('should update mindset', () => {
    // setup
    const mindset = new Mindset({
      id: 'id',
      scale: 1,
      pos: new Point({x: 100, y: 0})
    });

    const state = new State();
    state.model.mindset = mindset;

    const patch = new Patch({
      type: 'update-mindset',
      data: {id: 'id', scale: 2}
    });

    // target
    mutate(state, patch);

    // check
    expect(state.model.mindset).to.containSubset({
      id: 'id',
      scale: 2,
      pos: {x: 100}
    });
  });
});
