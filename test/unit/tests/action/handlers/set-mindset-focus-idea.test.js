import {expect} from 'test/utils';
import clone from 'clone';

import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';
import Point from 'src/model/entities/Point';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('set-mindset-focus-idea', () => {
  it('should update focus idea of mindset', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'set-mindset-focus-idea',
      data: {ideaId: 'A'}
    });

    // check
    const mutations = patch['update-mindset'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.deep.equal({
      id: mindset.id,
      focusIdeaId: 'A'
    });
  });

  it('should NOT mutate state', () => {
    // setup
    const ideaA = new Idea({
      id: 'A',
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const mindset = new Mindset({id: 'm'});
    mindset.ideas.set(ideaA.id, ideaA);

    const state = {model: {mindset}};
    const stateBefore = clone(state);

    // target
    handle(state, {
      type: 'set-mindset-focus-idea',
      data: {ideaId: 'A'}
    });

    // check

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it('should fail if target idea was not found in mindset', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'set-mindset-focus-idea',
        data: {ideaId: 'A'}
      });

    // check
    expect(result).to.throw(`Idea 'A' was not found in mindset`);
  });
});
