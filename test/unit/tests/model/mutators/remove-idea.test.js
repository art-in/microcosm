import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';

import mutate from 'model/mutators';

describe('remove-idea', () => {
  it('should remove idea from mindset', () => {
    // setup
    const mindset = new Mindset();

    mindset.ideas.set(
      'id',
      new Idea({
        id: 'id',
        value: 'old',
        color: 'white'
      })
    );

    const state = new State();
    state.model.mindset = mindset;

    const patch = new Patch({
      type: 'remove-idea',
      data: {id: 'id'}
    });

    // target
    mutate(state, patch);

    // check
    const ideas = values(state.model.mindset.ideas);

    expect(ideas).to.have.length(0);
  });

  it('should fail if target idea was not found', () => {
    // setup
    const state = new State();
    state.model.mindset = new Mindset();

    const patch = new Patch({
      type: 'remove-idea',
      data: {id: 'id'}
    });

    // target
    const result = () => mutate(state, patch);

    // check
    expect(result).to.throw(`Idea 'id' was not found`);
  });
});
