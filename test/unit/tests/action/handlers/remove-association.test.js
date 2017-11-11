import {expect} from 'test/utils';
import clone from 'clone';

import Mindmap from 'src/model/entities/Mindmap';

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
        const {root, nodes, links} = buildGraph([
            //       A   B   C
            /* A */ '0   1   1',
            /* B */ '0   0   1',
            /* C */ '0   0   0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const state = {model: {mindmap}};

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
        const {root, nodes, links} = buildGraph([
            //       A   B   C
            /* A */ '0   1   1',
            /* B */ '0   0   1',
            /* C */ '0   0   0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const assocAtoC = links.find(l => l.id === 'A to C');

        const state = {model: {mindmap}};

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
            associationsOut: []
        });
        expect(mutations[1].data).to.deep.equal({
            id: 'C',
            associationsIn: [assocAtoC]
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
        const {root, nodes, links} = buildGraph([
            //       A   B   C   D   E
            /* A */ '0   1   1   0   1',
            /* B */ '0   0   1   0   0',
            /* C */ '0   0   0   1   0',
            /* D */ '0   0   0   0   1',
            /* E */ '0   0   0   0   0'
        ]);

        const assocAtoB = links.find(l => l.id === 'A to B');
        const assocAtoE = links.find(l => l.id === 'A to E');
        const assocBtoC = links.find(l => l.id === 'B to C');

        // setup mindmap
        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));

        const state = {model: {mindmap}};

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
            linksToChilds: [assocAtoB, assocAtoE],
            associationsOut: [assocAtoB, assocAtoE]
        });

        expect(updateB).to.deep.equal({
            id: 'B',
            linksToChilds: [assocBtoC]
        });

        expect(updateC).to.deep.equal({
            id: 'C',
            rootPathWeight: 2,
            linkFromParent: assocBtoC,
            associationsIn: [assocBtoC]
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
        const {root, nodes, links} = buildGraph([
            //       A   B   C   D   E
            /* A */ '0   1   1   0   1',
            /* B */ '0   0   1   0   0',
            /* C */ '0   0   0   1   0',
            /* D */ '0   0   0   0   1',
            /* E */ '0   0   0   0   0'
        ]);

        // setup mindmap
        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));

        const state = {model: {mindmap}};
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
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-association',
            data: {assocId: 'A to B'}
        });

        // check
        expect(result).to.throw(
            `Association 'A to B' was not found`);
    });

    it('should fail if association miss reference to head idea', () => {
        
        // setup graph
        //
        //  (A) --> (B) --> (C)
        //    \_____________/
        //
        const {root, nodes, links} = buildGraph([
            //       A   B   C
            /* A */ '0   1   1',
            /* B */ '0   0   1',
            /* C */ '0   0   0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const assocBtoC = links.find(l => l.id === 'B to C');
        assocBtoC.from = null;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-association',
            data: {assocId: 'B to C'}
        });

        // check
        expect(result).to.throw(
            `Association 'B to C' has no reference to head idea`);
    });

    it('should fail if association miss reference to tail idea', () => {
        
        // setup graph
        //
        //  (A) --> (B) --> (C)
        //    \_____________/
        //
        const {root, nodes, links} = buildGraph([
            //       A   B   C
            /* A */ '0   1   1',
            /* B */ '0   0   1',
            /* C */ '0   0   0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const assocBtoC = links.find(l => l.id === 'B to C');
        assocBtoC.to = null;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-association',
            data: {assocId: 'B to C'}
        });

        // check
        expect(result).to.throw(
            `Association 'B to C' has no reference to tail idea`);
    });

    it('should fail if last association for tail idea ', () => {
        
        // setup graph
        //
        //  (A) --> (B) --> (C)
        //
        const {root, nodes, links} = buildGraph([
            //       A   B   C
            /* A */ '0   1   0',
            /* B */ '0   0   1',
            /* C */ '0   0   0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-association',
            data: {assocId: 'B to C'}
        });

        // check
        expect(result).to.throw(
            `Association 'B to C' cannot be removed because ` +
            `it is the last incoming association for idea 'C'`);
    });

    it('should fail if head idea miss reference to association', () => {
        
        // setup graph
        //
        //  (A) --> (B) --> (C)
        //    \_____________/
        //
        const {root, nodes, links} = buildGraph([
            //       A   B   C
            /* A */ '0   1   1',
            /* B */ '0   0   1',
            /* C */ '0   0   0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const ideaB = nodes.find(n => n.id === 'B');
        ideaB.associationsOut = [];

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-association',
            data: {assocId: 'B to C'}
        });

        // check
        expect(result).to.throw(
            `Head idea 'B' has no reference ` +
            `to outgoing association 'B to C'`);
    });

    it('should fail if tail idea miss reference to association', () => {
        
        // setup graph
        //
        //  (A) --> (B) --> (C)
        //    \_____________/
        //
        const {root, nodes, links} = buildGraph([
            //       A   B   C
            /* A */ '0   1   1',
            /* B */ '0   0   1',
            /* C */ '0   0   0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const ideaC = nodes.find(n => n.id === 'C');
        ideaC.associationsIn = [];

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'remove-association',
            data: {assocId: 'B to C'}
        });

        // check
        expect(result).to.throw(
            `Tail idea 'C' has no reference to ` +
            `incoming association 'B to C'`);
    });

});