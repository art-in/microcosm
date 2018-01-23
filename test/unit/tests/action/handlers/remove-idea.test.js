import {expect} from 'test/utils';
import clone from 'clone';

import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('remove-idea', () => {
  it('should remove idea', () => {
    // setup graph
    //
    //  (A) --> (B) --> (C)
    //    \_____________/
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C
      /* A */ '0   1   1',
      /* B */ '0   0   1',
      /* C */ '0   0   0'
    ]);

    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'remove-idea',
      data: {ideaId: 'C'}
    });

    // check
    const mutations = patch['remove-idea'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.deep.equal({id: 'C'});
  });

  it('should remove incoming associations', () => {
    // setup graph
    //
    //  (A) --> (B) --> (C)
    //    \_____________/
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C
      /* A */ '0   1   1',
      /* B */ '0   0   1',
      /* C */ '0   0   0'
    ]);

    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'remove-idea',
      data: {ideaId: 'C'}
    });

    // check
    const mutations = patch['remove-association'];

    expect(mutations).to.have.length(2);

    expect(mutations[0].data).to.deep.equal({id: 'A to C'});
    expect(mutations[1].data).to.deep.equal({id: 'B to C'});
  });

  it('should update successor ideas', () => {
    // setup graph
    //
    //  (A) --> (B) --> (C)
    //    \_____________/
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C
      /* A */ '0   1   1',
      /* B */ '0   0   1',
      /* C */ '0   0   0'
    ]);

    const assocAtoB = edges.find(l => l.id === 'A to B');

    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'remove-idea',
      data: {ideaId: 'C'}
    });

    // check
    const mutations = patch['update-idea'];

    expect(mutations).to.have.length(2);
    expect(mutations[0].data).to.deep.equal({
      id: 'A',
      edgesToChilds: [assocAtoB],
      edgesOut: [assocAtoB]
    });
    expect(mutations[1].data).to.deep.equal({
      id: 'B',
      edgesOut: []
    });
  });

  it('should NOT mutate state', () => {
    // setup graph
    //
    //  (A) --> (B) --> (C)
    //    \_____________/
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C
      /* A */ '0   1   1',
      /* B */ '0   0   1',
      /* C */ '0   0   0'
    ]);

    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};
    const stateBefore = clone(state);

    // target
    handle(state, {
      type: 'remove-idea',
      data: {ideaId: 'C'}
    });

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it('should target all state layers', () => {
    // setup graph
    //
    //  (A) --> (B) --> (C)
    //    \_____________/
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C
      /* A */ '0   1   1',
      /* B */ '0   0   1',
      /* C */ '0   0   0'
    ]);

    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'remove-idea',
      data: {ideaId: 'C'}
    });

    // check
    expect(patch.hasTarget('data')).to.be.true;
    expect(patch.hasTarget('model')).to.be.true;
    expect(patch.hasTarget('vm')).to.be.true;
    expect(patch.hasTarget('view')).to.be.true;
  });

  it('should fail if outgoing associations exist', () => {
    // setup graph
    //
    //  (A) --> (B) --> (C)
    //    \_____________/
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C
      /* A */ '0   1   1',
      /* B */ '0   0   1',
      /* C */ '0   0   0'
    ]);

    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-idea',
        data: {ideaId: 'B'}
      });

    // check
    expect(result).to.throw(
      `Unable to remove idea 'B' with outgoing associations`
    );
  });

  it('should fail if no incoming associations found', () => {
    // setup
    const mindset = new Mindset();

    mindset.ideas.set('A', new Idea({id: 'A'}));
    mindset.ideas.set('B', new Idea({id: 'B'}));

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-idea',
        data: {ideaId: 'B'}
      });

    // check
    expect(result).to.throw(`No incoming associations found for idea 'B'`);
  });

  it('should fail if idea not found', () => {
    // setup
    const mindset = new Mindset();

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-idea',
        data: {ideaId: 'uknown'}
      });

    // check
    expect(result).to.throw("Idea 'uknown' was not found in mindset");
  });

  it('should fail if idea is root', () => {
    // setup
    const mindset = new Mindset();

    mindset.ideas.set('root', new Idea({id: 'root', isRoot: true}));

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-idea',
        data: {ideaId: 'root'}
      });

    // check
    expect(result).to.throw('Unable to remove root idea');
  });
});
