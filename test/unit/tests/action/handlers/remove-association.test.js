import {expect} from 'test/utils';
import clone from 'clone';

import Mindset from 'src/model/entities/Mindset';
import Point from 'src/model/entities/Point';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('remove-association', () => {
  it('should remove association', () => {
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
      type: 'remove-association',
      data: {assocId: 'B to C'}
    });

    // check
    const mutations = patch['remove-association'];

    expect(mutations).to.have.length(1);
    expect(mutations[0].data).to.deep.equal({
      id: 'B to C'
    });
  });

  it('should update head and tail ideas', () => {
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

    const assocAtoC = edges.find(l => l.id === 'A to C');

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'remove-association',
      data: {assocId: 'B to C'}
    });

    // check
    const mutations = patch['update-idea'];

    expect(mutations).to.have.length(2);
    expect(mutations[0].data).to.deep.equal({
      id: 'B',
      edgesOut: []
    });
    expect(mutations[1].data).to.deep.equal({
      id: 'C',
      edgesIn: [assocAtoC]
    });
  });

  it('should update root paths', () => {
    // setup graph
    //     ______________________________
    //    /                              \
    //   (A) --> (B) --> (C) --> (D) --> (E)
    //    \_______________/
    //        to remove
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C   D   E
      /* A */ '0   1   1   0   1',
      /* B */ '0   0   1   0   0',
      /* C */ '0   0   0   1   0',
      /* D */ '0   0   0   0   1',
      /* E */ '0   0   0   0   0'
    ]);

    const ideaB = vertices.find(n => n.id === 'B');
    const ideaC = vertices.find(n => n.id === 'C');

    const assocAtoB = edges.find(l => l.id === 'A to B');
    const assocAtoE = edges.find(l => l.id === 'A to E');
    const assocBtoC = edges.find(l => l.id === 'B to C');

    // setup positions
    ideaB.posRel = new Point({x: 1, y: 0});
    ideaB.posAbs = new Point({x: 1, y: 0});

    ideaC.posRel = new Point({x: 2, y: 0});
    ideaC.posAbs = new Point({x: 2, y: 0});

    // setup mindset
    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'remove-association',
      data: {assocId: 'A to C'}
    });

    // check
    const mutations = patch['update-idea'];

    expect(mutations).to.have.length(4);

    const updateA = mutations.find(m => m.data.id === 'A').data;
    const updateB = mutations.find(m => m.data.id === 'B').data;
    const updateC = mutations.find(m => m.data.id === 'C').data;
    const updateD = mutations.find(m => m.data.id === 'D').data;

    expect(updateA).to.deep.equal({
      id: 'A',
      edgesToChilds: [assocAtoB, assocAtoE],
      edgesOut: [assocAtoB, assocAtoE]
    });

    expect(updateB).to.deep.equal({
      id: 'B',
      edgesToChilds: [assocBtoC]
    });

    expect(updateC).to.deep.equal({
      id: 'C',
      rootPathWeight: 2,
      edgeFromParent: assocBtoC,
      edgesIn: [assocBtoC],

      posRel: {x: 1, y: 0}
    });

    expect(updateD).to.deep.equal({
      id: 'D',
      rootPathWeight: 3
    });
  });

  it('should NOT mutate state', () => {
    // setup graph
    //     ______________________________
    //    /                              \
    //   (A) --> (B) --> (C) --> (D) --> (E)
    //    \_______________/
    //        to remove
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C   D   E
      /* A */ '0   1   1   0   1',
      /* B */ '0   0   1   0   0',
      /* C */ '0   0   0   1   0',
      /* D */ '0   0   0   0   1',
      /* E */ '0   0   0   0   0'
    ]);

    const ideaB = vertices.find(n => n.id === 'B');
    const ideaC = vertices.find(n => n.id === 'C');

    // setup positions
    ideaB.posRel = new Point({x: 1, y: 0});
    ideaB.posAbs = new Point({x: 1, y: 0});

    ideaC.posRel = new Point({x: 2, y: 0});
    ideaC.posAbs = new Point({x: 2, y: 0});

    // setup mindset
    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};
    const stateBefore = clone(state);

    // target
    handle(state, {
      type: 'remove-association',
      data: {assocId: 'A to C'}
    });

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it('should fail if association was not found', () => {
    // setup
    const mindset = new Mindset();

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-association',
        data: {assocId: 'A to B'}
      });

    // check
    expect(result).to.throw(`Association 'A to B' was not found`);
  });

  it('should fail if association miss reference to head idea', () => {
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

    const assocBtoC = edges.find(l => l.id === 'B to C');
    assocBtoC.from = null;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-association',
        data: {assocId: 'B to C'}
      });

    // check
    expect(result).to.throw(
      `Association 'B to C' has no reference to head idea`
    );
  });

  it('should fail if association miss reference to tail idea', () => {
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

    const assocBtoC = edges.find(l => l.id === 'B to C');
    assocBtoC.to = null;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-association',
        data: {assocId: 'B to C'}
      });

    // check
    expect(result).to.throw(
      `Association 'B to C' has no reference to tail idea`
    );
  });

  it('should fail if last association for tail idea ', () => {
    // setup graph
    //
    //  (A) --> (B) --> (C)
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C
      /* A */ '0   1   0',
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
        type: 'remove-association',
        data: {assocId: 'B to C'}
      });

    // check
    expect(result).to.throw(
      `Association 'B to C' cannot be removed because ` +
        `it is the last incoming association for idea 'C'`
    );
  });

  it('should fail if head idea miss reference to association', () => {
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

    const ideaB = vertices.find(n => n.id === 'B');
    ideaB.edgesOut = [];

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-association',
        data: {assocId: 'B to C'}
      });

    // check
    expect(result).to.throw(
      `Head idea 'B' has no reference ` + `to outgoing association 'B to C'`
    );
  });

  it('should fail if tail idea miss reference to association', () => {
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

    const ideaC = vertices.find(n => n.id === 'C');
    ideaC.edgesIn = [];

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'remove-association',
        data: {assocId: 'B to C'}
      });

    // check
    expect(result).to.throw(
      `Tail idea 'C' has no reference to ` + `incoming association 'B to C'`
    );
  });
});
