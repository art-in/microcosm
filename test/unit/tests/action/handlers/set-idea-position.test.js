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
            pos: new Point({x: 1, y: 1}),
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
                pos: new Point({x: 2, y: 2})
            }
        });

        // check
        const mutations = patch['update-idea'];

        expect(mutations).to.have.length(1);
        const updateA = mutations[0].data;

        expect(updateA).to.deep.equal({
            id: 'A',
            pos: {x: 2, y: 2}
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

        nodes.find(i => i.id === 'A').pos = new Point({x: 0, y: 0});
        nodes.find(i => i.id === 'B').pos = new Point({x: 1, y: 0});
        nodes.find(i => i.id === 'C').pos = new Point({x: 2, y: 0});
        nodes.find(i => i.id === 'D').pos = new Point({x: 2, y: 1});

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
                pos: new Point({x: 0, y: 1})
            }
        });

        // check
        const mutations = patch['update-idea'];
        
        expect(mutations).to.have.length(3);
        const posB = mutations.find(m => m.data.id === 'B').data.pos;
        const posC = mutations.find(m => m.data.id === 'C').data.pos;
        const posD = mutations.find(m => m.data.id === 'D').data.pos;

        expect(posB).to.containSubset({x: 0, y: 1});
        expect(posC).to.containSubset({x: 1, y: 1});
        expect(posD).to.containSubset({x: 1, y: 2});
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

        // setup positions
        nodes.find(i => i.id === 'A').pos = new Point({x: 0, y: 0});
        nodes.find(i => i.id === 'B').pos = new Point({x: 1, y: 0});
        nodes.find(i => i.id === 'C').pos = new Point({x: 0.5, y: 0.5});
        nodes.find(i => i.id === 'D').pos = new Point({x: 2, y: 1});
        nodes.find(i => i.id === 'E').pos = new Point({x: 3, y: 1});
        nodes.find(i => i.id === 'F').pos = new Point({x: 4, y: 1});

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
                pos: new Point({x: 1, y: 0.5})
            }
        });

        // check
        const mutations = patch['update-association'];
        
        // assocs inside child sub-tree were not affected (C to D to E to F)
        expect(mutations).to.have.length(4);
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
        //           (A)
        //          /  |       
        //         /   |
        //        /    |
        //       v     v
        //    (B) --> (C)
        //     |     /
        //     |    /
        //     |   /
        //     v  v
        //     (D) 
        //     
        //
        const {root, nodes, links} = buildGraph([
            //       A  B    C  D
            /* A */ '0  1.4  1  0',
            /* B */ '0  0    1  1',
            /* C */ '0  0    0  2',
            /* D */ '0  0    0  0'
        ]);

        // setup positions
        nodes.find(i => i.id === 'A').pos = new Point({x: 1, y: 0});
        nodes.find(i => i.id === 'B').pos = new Point({x: 0, y: 1});
        nodes.find(i => i.id === 'C').pos = new Point({x: 1, y: 1});
        nodes.find(i => i.id === 'D').pos = new Point({x: 0, y: 2});

        const assocCtoD = links.find(l => l.id === 'C to D');

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
                ideaId: 'D',
                pos: new Point({x: 1, y: 2})
            }
        });

        // check
        const mutations = patch['update-idea'];
        
        expect(mutations).to.have.length(3);
        
        const updateB = mutations.find(m => m.data.id === 'B').data;
        const updateC = mutations.find(m => m.data.id === 'C').data;
        const updateD = mutations.find(m => m.data.id === 'D').data;

        expect(updateB).to.deep.equal({
            id: 'B',
            linksToChilds: []
        });

        expect(updateC).to.deep.equal({
            id: 'C',
            linksToChilds: [assocCtoD]
        });

        expect(updateD).to.deep.equal({
            id: 'D',
            pos: {x: 1, y: 2},
            linkFromParent: assocCtoD,
            rootPathWeight: 2
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

        nodes.find(i => i.id === 'A').pos = new Point({x: 0, y: 0});
        nodes.find(i => i.id === 'B').pos = new Point({x: 1, y: 0});
        nodes.find(i => i.id === 'C').pos = new Point({x: 2, y: 0});
        nodes.find(i => i.id === 'D').pos = new Point({x: 2, y: 1});

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
                pos: new Point({x: 1, y: 0})
            }
        });

        // check
        expect(patch).to.have.length(0);
    });

    it('should NOT mutate state', () => {
        
        // setup graph
        //
        //           (A)
        //          /  |       
        //         /   |
        //        /    |
        //       v     v
        //    (B) --> (C)
        //     |     /
        //     |    /
        //     |   /
        //     v  v
        //     (D) 
        //     
        //
        const {root, nodes, links} = buildGraph([
            //       A  B    C  D
            /* A */ '0  1.4  1  0',
            /* B */ '0  0    1  1',
            /* C */ '0  0    0  2',
            /* D */ '0  0    0  0'
        ]);

        // setup positions
        nodes.find(i => i.id === 'A').pos = new Point({x: 1, y: 0});
        nodes.find(i => i.id === 'B').pos = new Point({x: 0, y: 1});
        nodes.find(i => i.id === 'C').pos = new Point({x: 1, y: 1});
        nodes.find(i => i.id === 'D').pos = new Point({x: 0, y: 2});

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
                ideaId: 'D',
                pos: new Point({x: 1, y: 2})
            }
        });

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should target all state layers', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            pos: new Point({x: 1, y: 1})
        });

        ideaA.linksToChilds = [];

        const mindmap = new Mindmap();
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'A',
                pos: new Point({x: 2, y: 2})
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});