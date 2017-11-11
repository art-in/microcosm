import {expect} from 'test/utils';
import clone from 'clone';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('create-cross-association', () => {

    it('should add association to mindmap', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            pos: new Point({x: 0, y: 0}),
            linkFromParent: null,
            linksToChilds: []
        });

        const ideaB = new Idea({
            id: 'B',
            pos: new Point({x: 10, y: 10}),
            linkFromParent: null,
            linksToChilds: []
        });

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

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
        expect(data.assoc.mindmapId).to.equal('m');

        expect(data.assoc.fromId).to.equal('A');
        expect(data.assoc.from).to.equal(ideaA);

        expect(data.assoc.toId).to.equal('B');
        expect(data.assoc.to).to.equal(ideaB);

        expect(data.assoc.weight).to.be.closeTo(14, 0.2);
    });

    it('should update head and tail ideas', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            pos: new Point({x: 0, y: 0}),
            linkFromParent: null,
            linksToChilds: [],
            rootPathWeight: 0
        });

        const ideaB = new Idea({
            id: 'B',
            pos: new Point({x: 0, y: 10}),
            linkFromParent: null,
            linksToChilds: [],
            rootPathWeight: 100
        });

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

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
            associationsOut: [assoc],
            linksToChilds: [assoc]
        });

        expect(mutations[1].data).to.deep.equal({
            id: 'B',
            associationsIn: [assoc],
            linkFromParent: assoc,
            rootPathWeight: 10
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
        const {root, nodes, links} = buildGraph([
            //       A   B   C   D   E
            /* A */ '0   1   0   0   1',
            /* B */ '0   0   1   0   0',
            /* C */ '0   0   0   1   0',
            /* D */ '0   0   0   0   1',
            /* E */ '0   0   0   0   0'
        ]);

        const ideaA = nodes.find(n => n.id === 'A');
        const ideaC = nodes.find(n => n.id === 'C');

        const assocAtoB = links.find(l => l.id === 'A to B');
        const assocAtoE = links.find(l => l.id === 'A to E');
        const assocBtoC = links.find(l => l.id === 'B to C');

        ideaA.pos = new Point({x: 0, y: 0});
        ideaC.pos = new Point({x: 1, y: 0});

        // setup mindmap
        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));

        const state = {model: {mindmap}};

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
            linksToChilds: [assocAtoB, assocAtoE, assocAtoC],
            associationsOut: [assocAtoB, assocAtoE, assocAtoC]
        });

        expect(updateB).to.deep.equal({
            id: 'B',
            linksToChilds: []
        });

        expect(updateC).to.deep.equal({
            id: 'C',
            rootPathWeight: 1,
            linkFromParent: assocAtoC,
            associationsIn: [assocBtoC, assocAtoC]
        });

        expect(updateD).to.deep.equal({
            id: 'D',
            rootPathWeight: 2
        });
    });

    it('should NOT mutate state', () => {

        // setup graph
        //     ______________________________
        //    /                              \
        //   (A) --> (B) --> (C) --> (D) --> (E)
        //    \_______________/
        //         to add
        //
        const {root, nodes, links} = buildGraph([
            //       A   B   C   D   E
            /* A */ '0   1   0   0   1',
            /* B */ '0   0   1   0   0',
            /* C */ '0   0   0   1   0',
            /* D */ '0   0   0   0   1',
            /* E */ '0   0   0   0   0'
        ]);


        const ideaA = nodes.find(n => n.id === 'A');
        const ideaC = nodes.find(n => n.id === 'C');

        ideaA.pos = new Point({x: 0, y: 0});
        ideaC.pos = new Point({x: 1, y: 0});

        // setup mindmap
        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));

        const state = {model: {mindmap}};
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
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            pos: new Point({x: 0, y: 0}),
            linkFromParent: null,
            linksToChilds: []
        });

        const ideaB = new Idea({
            id: 'B',
            pos: new Point({x: 10, y: 10}),
            linkFromParent: null,
            linksToChilds: []
        });

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

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
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaTail = new Idea({id: 'B'});

        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaTail;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'A',
                tailIdeaId: 'B'
            }
        });

        // check
        expect(result).to.throw(`Idea 'A' was not found in mindmap`);
    });

    it('should fail if tail ideas was not found', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaA = new Idea({id: 'A', isRoot: true});

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'A',
                tailIdeaId: 'B'
            }
        });

        // check
        expect(result).to.throw(`Idea 'B' was not found in mindmap`);
    });

    it('should fail if self-association', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            linkFromParent: null,
            linksToChilds: []
        });

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'A',
                tailIdeaId: 'A'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to add self-association on idea 'A'`);
    });

    it('should fail if duplicate association', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaA = new Idea({id: 'A', isRoot: true});
        const ideaB = new Idea({id: 'B'});

        const assocAtoB = new Association({
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaB.id,
            to: ideaB
        });

        ideaA.associationsOut = [assocAtoB];
        ideaA.linkFromParent = null;
        ideaA.linksToChilds = [assocAtoB];
        
        ideaB.associationsIn = [assocAtoB];
        ideaB.linkFromParent = assocAtoB;
        ideaB.linksToChilds = [];

        // setup mindmap
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.associations.set(assocAtoB.id, assocAtoB);

        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'A',
                tailIdeaId: 'B'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to create duplicate association ` +
            `between ideas 'A' and 'B'`);
    });

    it('should fail if association to predecessor', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            linkFromParent: null,
            linksToChilds: []
        });
        const ideaB = new Idea({
            id: 'B',
            linkFromParent: null,
            linksToChilds: []
        });

        const assocAtoB = new Association({
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaB.id,
            to: ideaB
        });

        ideaA.associationsOut = [assocAtoB];
        ideaB.associationsIn = [assocAtoB];

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.associations.set(assocAtoB.id, assocAtoB);

        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'B',
                tailIdeaId: 'A'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to create association from idea 'B' ` +
            `to its predecessor idea 'A'`);
    });

    it('should fail if association to root', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaA = new Idea({id: 'A'});
        const ideaB = new Idea({id: 'B', isRoot: true});

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);

        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'A',
                tailIdeaId: 'B'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to create association from idea 'A' ` +
            `to root idea 'B'`);
    });

});