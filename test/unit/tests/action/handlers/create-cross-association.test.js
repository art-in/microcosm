import clone from 'clone';

import {expect} from 'test/utils';
import getRangeAroundNow from 'test/utils/get-range-around-now';

import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import dateIsoRegexp from 'src/utils/date-iso-regexp';
import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('create-cross-association', () => {
  it('should add association to mindset', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({
      id: 'A',
      isRoot: true,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgeFromParent: null,
      edgesToChilds: []
    });

    const ideaB = new Idea({
      id: 'B',
      posRel: new Point({x: 10, y: 10}),
      posAbs: new Point({x: 10, y: 10}),
      edgeFromParent: null,
      edgesToChilds: []
    });

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.ideas.set(ideaB.id, ideaB);
    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-cross-association',
      data: {
        headIdeaId: 'A',
        tailIdeaId: 'B'
      }
    });

    // check
    const mutations = patch['add-association'];

    expect(mutations).to.have.length(1);
    const {data} = mutations[0];

    expect(data.assoc).to.be.instanceOf(Association);
    expect(data.assoc.mindsetId).to.equal('m');

    expect(data.assoc.fromId).to.equal('A');
    expect(data.assoc.from).to.equal(ideaA);

    expect(data.assoc.toId).to.equal('B');
    expect(data.assoc.to).to.equal(ideaB);

    expect(data.assoc.weight).to.be.closeTo(14, 0.2);
  });

  it('should update head and tail ideas', () => {
    // setup
    const mindset = new Mindset();

    const ideaA = new Idea({
      id: 'A',
      isRoot: true,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgeFromParent: null,
      edgesToChilds: [],
      rootPathWeight: 0
    });

    const ideaB = new Idea({
      id: 'B',
      posRel: new Point({x: 0, y: 10}),
      posAbs: new Point({x: 0, y: 10}),
      edgeFromParent: null,
      edgesToChilds: [],
      rootPathWeight: 100
    });

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.ideas.set(ideaB.id, ideaB);
    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-cross-association',
      data: {
        headIdeaId: 'A',
        tailIdeaId: 'B'
      }
    });

    // check
    const mutations = patch['update-idea'];
    const {assoc} = patch['add-association'][0].data;

    expect(mutations).to.have.length(2);

    expect(mutations[0].data).to.deep.equal({
      id: 'A',
      edgesOut: [assoc],
      edgesToChilds: [assoc]
    });

    expect(mutations[1].data).to.deep.equal({
      id: 'B',
      edgesIn: [assoc],
      edgeFromParent: assoc,
      rootPathWeight: 10,

      posRel: {x: 0, y: 10}
    });
  });

  it('should update minimal root paths', () => {
    // setup graph
    //     ______________________________
    //    /                              \
    //   (A) --> (B) --> (C) --> (D) --> (E)
    //    \_______________/
    //         to add
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C   D   E
      /* A */ '0   1   0   0   1',
      /* B */ '0   0   1   0   0',
      /* C */ '0   0   0   1   0',
      /* D */ '0   0   0   0   1',
      /* E */ '0   0   0   0   0'
    ]);

    const ideaA = vertices.find(n => n.id === 'A');
    const ideaC = vertices.find(n => n.id === 'C');

    const assocAtoB = edges.find(l => l.id === 'A to B');
    const assocAtoE = edges.find(l => l.id === 'A to E');
    const assocBtoC = edges.find(l => l.id === 'B to C');

    // setup positions
    ideaA.posRel = new Point({x: 0, y: 0});
    ideaA.posAbs = new Point({x: 0, y: 0});

    ideaC.posRel = new Point({x: 1.9, y: 0});
    ideaC.posAbs = new Point({x: 1.9, y: 0});

    // setup mindset
    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-cross-association',
      data: {
        headIdeaId: 'A',
        tailIdeaId: 'C'
      }
    });

    // check
    const mutations = patch['update-idea'];
    const {assoc: assocAtoC} = patch['add-association'][0].data;

    expect(mutations).to.have.length(4);

    const updateA = mutations.find(m => m.data.id === 'A').data;
    const updateB = mutations.find(m => m.data.id === 'B').data;
    const updateC = mutations.find(m => m.data.id === 'C').data;
    const updateD = mutations.find(m => m.data.id === 'D').data;

    expect(updateA).to.deep.equal({
      id: 'A',
      edgesToChilds: [assocAtoB, assocAtoE, assocAtoC],
      edgesOut: [assocAtoB, assocAtoE, assocAtoC]
    });

    expect(updateB).to.deep.equal({
      id: 'B',
      edgesToChilds: []
    });

    expect(updateC).to.deep.equal({
      id: 'C',
      rootPathWeight: 1.9,
      edgeFromParent: assocAtoC,
      edgesIn: [assocBtoC, assocAtoC],

      posRel: {x: 1.9, y: 0}
    });

    expect(updateD).to.deep.equal({
      id: 'D',
      rootPathWeight: 2.9
    });
  });

  it('should set now as association creation time', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({
      id: 'A',
      isRoot: true,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgeFromParent: null,
      edgesToChilds: []
    });

    const ideaB = new Idea({
      id: 'B',
      posRel: new Point({x: 10, y: 10}),
      posAbs: new Point({x: 10, y: 10}),
      edgeFromParent: null,
      edgesToChilds: []
    });

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.ideas.set(ideaB.id, ideaB);
    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-cross-association',
      data: {
        headIdeaId: 'A',
        tailIdeaId: 'B'
      }
    });

    // check
    const mutations = patch['add-association'];

    expect(mutations).to.have.length(1);
    const {assoc} = mutations[0].data;

    const {nowStart, nowEnd} = getRangeAroundNow();

    expect(assoc.createdOn).to.be.a('string');
    expect(assoc.createdOn).to.match(dateIsoRegexp);
    expect(new Date(assoc.createdOn)).to.be.withinTime(nowStart, nowEnd);
  });

  it('should NOT mutate state', () => {
    // setup graph
    //     ______________________________
    //    /                              \
    //   (A) --> (B) --> (C) --> (D) --> (E)
    //    \_______________/
    //         to add
    //
    const {root, vertices, edges} = buildGraph([
      //       A   B   C   D   E
      /* A */ '0   1   0   0   1',
      /* B */ '0   0   1   0   0',
      /* C */ '0   0   0   1   0',
      /* D */ '0   0   0   0   1',
      /* E */ '0   0   0   0   0'
    ]);

    const ideaA = vertices.find(n => n.id === 'A');
    const ideaC = vertices.find(n => n.id === 'C');

    ideaA.posRel = new Point({x: 0, y: 0});
    ideaA.posAbs = new Point({x: 0, y: 0});

    ideaC.posRel = new Point({x: 1, y: 0});
    ideaC.posAbs = new Point({x: 1, y: 0});

    // setup mindset
    const mindset = new Mindset();

    mindset.root = root;
    vertices.forEach(n => mindset.ideas.set(n.id, n));
    edges.forEach(l => mindset.associations.set(l.id, l));

    const state = {model: {mindset}};
    const stateBefore = clone(state);

    // target
    handle(state, {
      type: 'create-cross-association',
      data: {
        headIdeaId: 'A',
        tailIdeaId: 'C'
      }
    });

    // check
    expect(state).to.deep.equal(stateBefore);
  });

  it('should target all state layers', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({
      id: 'A',
      isRoot: true,
      posRel: new Point({x: 0, y: 0}),
      posAbs: new Point({x: 0, y: 0}),
      edgeFromParent: null,
      edgesToChilds: []
    });

    const ideaB = new Idea({
      id: 'B',
      posRel: new Point({x: 10, y: 10}),
      posAbs: new Point({x: 10, y: 10}),
      edgeFromParent: null,
      edgesToChilds: []
    });

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.ideas.set(ideaB.id, ideaB);
    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const patch = handle(state, {
      type: 'create-cross-association',
      data: {
        headIdeaId: 'A',
        tailIdeaId: 'B'
      }
    });

    // check
    expect(patch.hasTarget('data')).to.be.true;
    expect(patch.hasTarget('model')).to.be.true;
    expect(patch.hasTarget('vm')).to.be.true;
    expect(patch.hasTarget('view')).to.be.true;
  });

  it('should fail if head ideas was not found', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaTail = new Idea({id: 'B'});

    mindset.ideas.set(ideaTail.id, ideaTail);
    mindset.root = ideaTail;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-cross-association',
        data: {
          headIdeaId: 'A',
          tailIdeaId: 'B'
        }
      });

    // check
    expect(result).to.throw(`Idea 'A' was not found in mindset`);
  });

  it('should fail if tail ideas was not found', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({id: 'A', isRoot: true});

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-cross-association',
        data: {
          headIdeaId: 'A',
          tailIdeaId: 'B'
        }
      });

    // check
    expect(result).to.throw(`Idea 'B' was not found in mindset`);
  });

  it('should fail if self-association', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({
      id: 'A',
      isRoot: true,
      edgeFromParent: null,
      edgesToChilds: []
    });

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-cross-association',
        data: {
          headIdeaId: 'A',
          tailIdeaId: 'A'
        }
      });

    // check
    expect(result).to.throw(`Unable to add self-association on idea 'A'`);
  });

  it('should fail if duplicate association', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({id: 'A', isRoot: true});
    const ideaB = new Idea({id: 'B'});

    const assocAtoB = new Association({
      fromId: ideaA.id,
      from: ideaA,
      toId: ideaB.id,
      to: ideaB
    });

    ideaA.edgesOut = [assocAtoB];
    ideaA.edgeFromParent = null;
    ideaA.edgesToChilds = [assocAtoB];

    ideaB.edgesIn = [assocAtoB];
    ideaB.edgeFromParent = assocAtoB;
    ideaB.edgesToChilds = [];

    // setup mindset
    mindset.ideas.set(ideaA.id, ideaA);
    mindset.ideas.set(ideaB.id, ideaB);
    mindset.associations.set(assocAtoB.id, assocAtoB);

    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-cross-association',
        data: {
          headIdeaId: 'A',
          tailIdeaId: 'B'
        }
      });

    // check
    expect(result).to.throw(
      `Unable to create duplicate association ` + `between ideas 'A' and 'B'`
    );
  });

  it('should fail if association to predecessor', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({
      id: 'A',
      isRoot: true,
      edgeFromParent: null,
      edgesToChilds: []
    });
    const ideaB = new Idea({
      id: 'B',
      edgeFromParent: null,
      edgesToChilds: []
    });

    const assocAtoB = new Association({
      fromId: ideaA.id,
      from: ideaA,
      toId: ideaB.id,
      to: ideaB
    });

    ideaA.edgesOut = [assocAtoB];
    ideaB.edgesIn = [assocAtoB];

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.ideas.set(ideaB.id, ideaB);
    mindset.associations.set(assocAtoB.id, assocAtoB);

    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-cross-association',
        data: {
          headIdeaId: 'B',
          tailIdeaId: 'A'
        }
      });

    // check
    expect(result).to.throw(
      `Unable to create association from idea 'B' ` +
        `to its predecessor idea 'A'`
    );
  });

  it('should fail if association to root', () => {
    // setup
    const mindset = new Mindset({id: 'm'});

    const ideaA = new Idea({id: 'A'});
    const ideaB = new Idea({id: 'B', isRoot: true});

    mindset.ideas.set(ideaA.id, ideaA);
    mindset.ideas.set(ideaB.id, ideaB);

    mindset.root = ideaA;

    const state = {model: {mindset}};

    // target
    const result = () =>
      handle(state, {
        type: 'create-cross-association',
        data: {
          headIdeaId: 'A',
          tailIdeaId: 'B'
        }
      });

    // check
    expect(result).to.throw(
      `Unable to create association from idea 'A' ` + `to root idea 'B'`
    );
  });
});
