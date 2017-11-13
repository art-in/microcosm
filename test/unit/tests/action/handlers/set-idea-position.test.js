import {expect} from 'test/utils';
import clone from 'clone';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Point from 'src/model/entities/Point';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('set-idea-position', () => {
    
    it('should update idea position', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 1, y: 1}),
            linksToChilds: [],
            linkFromParent: null,
            rootPathWeight: 0
        });

        const mindmap = new Mindmap();
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'A',
                posAbs: new Point({x: 2, y: 2})
            }
        });

        // check
        const mutations = patch['update-idea'];

        expect(mutations).to.have.length(1);
        const updateA = mutations[0].data;

        expect(updateA).to.deep.equal({
            id: 'A',
            posAbs: {x: 2, y: 2},
            posRel: {x: 2, y: 2}
        });
    });

    it('should update positions of descendant ideas', () => {

        // setup
        //
        //   (A) --> (B) --> (C)
        //             \
        //              \--> (D)
        //
        const {root, nodes, links} = buildGraph([
            //       A  B  C  D
            /* A */ '0  1  0  0',
            /* B */ '0  0  1  1',
            /* C */ '0  0  0  0',
            /* D */ '0  0  0  0'
        ]);

        const nodeA = nodes.find(i => i.id === 'A');
        const nodeB = nodes.find(i => i.id === 'B');
        const nodeC = nodes.find(i => i.id === 'C');
        const nodeD = nodes.find(i => i.id === 'D');

        // setup positions
        const posA = {x: 0, y: 0};
        const posB = {x: 1, y: 0};
        const posC = {x: 2, y: 0};
        const posD = {x: 2, y: 1};

        nodeA.posAbs = new Point(posA);
        nodeA.posRel = new Point(posA);

        nodeB.posAbs = new Point(posB);
        nodeB.posRel = new Point(posB);

        nodeC.posAbs = new Point(posC);
        nodeC.posRel = new Point(posC);

        nodeD.posAbs = new Point(posD);
        nodeD.posRel = new Point(posD);

        // setup mindmap
        const mindmap = new Mindmap();

        mindmap.root = root;
        nodes.forEach(i => mindmap.ideas.set(i.id, i));
        links.forEach(a => mindmap.associations.set(a.id, a));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'B',
                posAbs: new Point({x: 0, y: 1})
            }
        });

        // check
        const mutations = patch['update-idea'];
        
        expect(mutations).to.have.length(3);
        const posAbsB = mutations.find(m => m.data.id === 'B').data.posAbs;
        const posAbsC = mutations.find(m => m.data.id === 'C').data.posAbs;
        const posAbsD = mutations.find(m => m.data.id === 'D').data.posAbs;

        const posRelB = mutations.find(m => m.data.id === 'B').data.posRel;
        const posRelC = mutations.find(m => m.data.id === 'C').data.posRel;
        const posRelD = mutations.find(m => m.data.id === 'D').data.posRel;

        expect(posAbsB).to.containSubset({x: 0, y: 1});
        expect(posAbsC).to.containSubset({x: 1, y: 1});
        expect(posAbsD).to.containSubset({x: 1, y: 2});

        expect(posRelB).to.containSubset({x: 0, y: 1});
        expect(posRelC).to.equal(undefined);
        expect(posRelD).to.equal(undefined);
    });

    it('should update weights of affected associations', () => {

        // setup graph
        //
        //   (A) --> (B) <--------------
        //      \   /   \--------       \ 
        //       v v             v       \
        //       (C) --> (D) --> (E) --> (F)
        //
        const {root, nodes, links} = buildGraph([
            //       A  B  C  D  E  F
            /* A */ '0  1  1  0  0  0',
            /* B */ '0  0  1  0  4  0',
            /* C */ '0  0  0  1  0  0',
            /* D */ '0  0  0  0  1  0',
            /* E */ '0  0  0  0  0  1',
            /* F */ '0  5  0  0  0  0'
        ]);

        const nodeA = nodes.find(i => i.id === 'A');
        const nodeB = nodes.find(i => i.id === 'B');
        const nodeC = nodes.find(i => i.id === 'C');
        const nodeD = nodes.find(i => i.id === 'D');
        const nodeE = nodes.find(i => i.id === 'E');
        const nodeF = nodes.find(i => i.id === 'F');

        // setup positions
        nodeA.posAbs = new Point({x: 0, y: 0});
        nodeA.posRel = new Point({x: 0, y: 0});

        nodeB.posAbs = new Point({x: 1, y: 0});
        nodeB.posRel = new Point({x: 1, y: 0});

        nodeC.posAbs = new Point({x: 0.5, y: 0.5});
        nodeC.posRel = new Point({x: 0.5, y: 0.5});

        nodeD.posAbs = new Point({x: 2, y: 1});
        nodeD.posRel = new Point({x: 1.5, y: 0});

        nodeE.posAbs = new Point({x: 3, y: 1});
        nodeE.posRel = new Point({x: 1, y: 0});

        nodeF.posAbs = new Point({x: 4, y: 1});
        nodeF.posRel = new Point({x: 1, y: 0});

        // setup mindmap
        const mindmap = new Mindmap();
        mindmap.root = root;
        nodes.forEach(i => mindmap.ideas.set(i.id, i));
        links.forEach(a => mindmap.associations.set(a.id, a));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'C',
                posAbs: new Point({x: 1, y: 0.5})
            }
        });

        // check
        const mutations = patch['update-association'];
        
        expect(mutations).to.have.length(4);

        // assocs inside child sub-tree (C to D to E to F) were not affected
        const updateAtoC = mutations.find(m => m.data.id === 'A to C').data;
        const updateBtoC = mutations.find(m => m.data.id === 'B to C').data;
        const updateBtoE = mutations.find(m => m.data.id === 'B to E').data;
        const updateFtoB = mutations.find(m => m.data.id === 'F to B').data;

        expect(updateAtoC.weight).to.be.closeTo(1.1, 0.1);
        expect(updateBtoC.weight).to.equal(0.5);
        expect(updateBtoE.weight).to.be.closeTo(2.7, 0.1);
        expect(updateFtoB.weight).to.be.closeTo(3.7, 0.1);
    });

    it('should update root paths', () => {
        
        // setup graph
        //
        //          (B)
        //          ^  \
        //         /    \
        //        /      \
        //       /        v
        //    (A)          (C)
        //     \ \           ^
        //      \ \         /
        //       \ \-----------> (E)
        //        \       /      /  \
        //         \     /      /    \
        //          \   /      /      \
        //           v /      /        v
        //           (D) <----         (F)
        //
        const {root, nodes, links} = buildGraph([
            //       A  B    C    D    E  F
            /* A */ '0  1.4  0    2.5  1  0',
            /* B */ '0  0    1.4  0    0  0',
            /* C */ '0  0    0    0    0  0',
            /* D */ '0  0    2.5  0    0  0',
            /* E */ '0  0    0    1.4  0  1.4',
            /* F */ '0  0    0    0    0  0'
        ]);

        const nodeA = nodes.find(i => i.id === 'A');
        const nodeB = nodes.find(i => i.id === 'B');
        const nodeC = nodes.find(i => i.id === 'C');
        const nodeD = nodes.find(i => i.id === 'D');
        const nodeE = nodes.find(i => i.id === 'E');
        const nodeF = nodes.find(i => i.id === 'F');

        const assocAtoB = links.find(l => l.id === 'A to B');
        const assocAtoD = links.find(l => l.id === 'A to D');
        const assocAtoE = links.find(l => l.id === 'A to E');
        const assocDtoC = links.find(l => l.id === 'D to C');
        const assocEtoF = links.find(l => l.id === 'E to F');

        // setup positions
        nodeA.posAbs = new Point({x: 0, y: 1});
        nodeA.posRel = new Point({x: 0, y: 1});

        nodeB.posAbs = new Point({x: 1, y: 0});
        nodeB.posRel = new Point({x: 1, y: -1});

        nodeC.posAbs = new Point({x: 2, y: 1});
        nodeC.posRel = new Point({x: 1, y: 1});

        nodeD.posAbs = new Point({x: 1, y: 2});
        nodeD.posRel = new Point({x: -1, y: 1});

        nodeE.posAbs = new Point({x: 2, y: 1});
        nodeE.posRel = new Point({x: 2, y: 0});

        nodeF.posAbs = new Point({x: 3, y: 2});
        nodeF.posRel = new Point({x: 1, y: 1});

        // setup mindmap
        const mindmap = new Mindmap();
        mindmap.root = root;
        nodes.forEach(i => mindmap.ideas.set(i.id, i));
        links.forEach(a => mindmap.associations.set(a.id, a));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'E',
                posAbs: new Point({x: 2, y: 0})
            }
        });

        // check
        const mutations = patch['update-idea'];
        
        expect(mutations).to.have.length(6);
        
        const updateA = mutations.find(m => m.data.id === 'A').data;
        const updateB = mutations.find(m => m.data.id === 'B').data;
        const updateC = mutations.find(m => m.data.id === 'C').data;
        const updateD = mutations.find(m => m.data.id === 'D').data;
        const updateE = mutations.find(m => m.data.id === 'E').data;
        const updateF = mutations.find(m => m.data.id === 'F').data;

        expect(updateA).to.deep.equal({
            id: 'A',
            linksToChilds: [assocAtoB, assocAtoD, assocAtoE]
        });

        expect(updateB).to.deep.equal({
            id: 'B',
            linksToChilds: []
        });

        expect(updateC).to.deep.equal({
            id: 'C',
            linkFromParent: assocDtoC,
            rootPathWeight: 2,

            posRel: {x: 1, y: 0}
        });

        expect(updateD).to.deep.equal({
            id: 'D',
            linkFromParent: assocAtoD,
            linksToChilds: [assocDtoC],
            rootPathWeight: 1,

            posAbs: {x: 1, y: 1},
            posRel: {x: 1, y: 0}
        });

        expect(updateE).to.deep.equal({
            id: 'E',
            linksToChilds: [assocEtoF],
            rootPathWeight: Math.sqrt(5),

            posAbs: {x: 2, y: 0},
            posRel: {x: 2, y: -1}
        });

        expect(updateF).to.deep.equal({
            id: 'F',
            rootPathWeight: Math.sqrt(5) + 1.4,

            posAbs: {x: 3, y: 1}
        });
    });

    it('should NOT update if position was not changed', () => {

        // setup
        //
        //   (A) --> (B) --> (C)
        //             \
        //              \--> (D)
        //
        const {root, nodes, links} = buildGraph([
            //       A  B  C  D
            /* A */ '0  1  0  0',
            /* B */ '0  0  1  1',
            /* C */ '0  0  0  0',
            /* D */ '0  0  0  0'
        ]);

        nodes.find(i => i.id === 'A').posAbs = new Point({x: 0, y: 0});
        nodes.find(i => i.id === 'B').posAbs = new Point({x: 1, y: 0});
        nodes.find(i => i.id === 'C').posAbs = new Point({x: 2, y: 0});
        nodes.find(i => i.id === 'D').posAbs = new Point({x: 2, y: 1});

        const mindmap = new Mindmap();

        mindmap.root = root;
        nodes.forEach(i => mindmap.ideas.set(i.id, i));
        links.forEach(a => mindmap.associations.set(a.id, a));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'B',
                posAbs: new Point({x: 1, y: 0})
            }
        });

        // check
        expect(patch).to.have.length(0);
    });

    it('should NOT mutate state', () => {
        
        // setup graph
        //
        //          (B)
        //          ^  \
        //         /    \
        //        /      \
        //       /        v
        //    (A)          (C)
        //     \ \           ^
        //      \ \         /
        //       \ \-----------> (E)
        //        \       /      /  \
        //         \     /      /    \
        //          \   /      /      \
        //           v /      /        v
        //           (D) <----         (F)
        //
        const {root, nodes, links} = buildGraph([
            //       A  B    C    D    E  F
            /* A */ '0  1.4  0    2.5  1  0',
            /* B */ '0  0    1.4  0    0  0',
            /* C */ '0  0    0    0    0  0',
            /* D */ '0  0    2.5  0    0  0',
            /* E */ '0  0    0    1.4  0  1.4',
            /* F */ '0  0    0    0    0  0'
        ]);

        const nodeA = nodes.find(i => i.id === 'A');
        const nodeB = nodes.find(i => i.id === 'B');
        const nodeC = nodes.find(i => i.id === 'C');
        const nodeD = nodes.find(i => i.id === 'D');
        const nodeE = nodes.find(i => i.id === 'E');
        const nodeF = nodes.find(i => i.id === 'F');

        // setup positions
        nodeA.posAbs = new Point({x: 0, y: 1});
        nodeA.posRel = new Point({x: 0, y: 1});

        nodeB.posAbs = new Point({x: 1, y: 0});
        nodeB.posRel = new Point({x: 1, y: -1});

        nodeC.posAbs = new Point({x: 2, y: 1});
        nodeC.posRel = new Point({x: 1, y: 1});

        nodeD.posAbs = new Point({x: 1, y: 2});
        nodeD.posRel = new Point({x: -1, y: 1});

        nodeE.posAbs = new Point({x: 2, y: 1});
        nodeE.posRel = new Point({x: 2, y: 0});

        nodeF.posAbs = new Point({x: 3, y: 2});
        nodeF.posRel = new Point({x: 1, y: 1});

        // setup mindmap
        const mindmap = new Mindmap();
        mindmap.root = root;
        nodes.forEach(i => mindmap.ideas.set(i.id, i));
        links.forEach(a => mindmap.associations.set(a.id, a));

        const state = {model: {mindmap}};
        const stateBefore = clone(state);

        // target
        handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'E',
                posAbs: new Point({x: 2, y: 0})
            }
        });

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should target all state layers', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            posRel: new Point({x: 0, y: 0}),
            posAbs: new Point({x: 1, y: 1}),
            linksToChilds: [],
            linkFromParent: null,
            rootPathWeight: 0
        });

        const mindmap = new Mindmap();
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'A',
                posAbs: new Point({x: 2, y: 2})
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});