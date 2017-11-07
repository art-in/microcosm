import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import buildGraph from 'src/model/utils/build-ideas-graph-from-matrix';

import values from 'src/utils/get-map-values';

describe('add-association', () => {
    
    it('should add association to map', () => {

        // setup
        const mindmap = new Mindmap();
        
        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    value: 'test',
                    fromId: 'head',
                    toId: 'tail',
                    weight: 1
                })
            }});

        // target
        mutate(state, patch);
        
        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'assoc',
            value: 'test'
        });
    });

    it('should set head idea to association', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail',
                    weight: 1
                })
            }});

        // target
        mutate(state, patch);

        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            fromId: 'head',
            from: {id: 'head'}
        });
    });

    it('should set tail idea to association', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail',
                    weight: 1
                })
            }});

        // target
        mutate(state, patch);

        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            toId: 'tail',
            to: {id: 'tail'}
        });
    });

    it('should set association to head idea as outgoing', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail',
                    weight: 1
                })
            }});

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'head',
            associationsOut: [{
                id: 'assoc'
            }]
        }]);
    });

    it('should set association to tail idea as incoming', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail',
                    weight: 1
                })
            }});

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'tail',
            associationsIn: [{
                id: 'assoc'
            }]
        }]);

    });

    it('should update minimal root paths', () => {

        // setup
        //     ______________________________
        //    /                              \
        //   (A) --> (B) --> (C) --> (D) --> (E)
        //    \_______________/
        //        new assoc
        //
        const {root, nodes, links} = buildGraph([
            //       A   B      C      D     E
            /* A */ '0   1      0      0     1',
            /* B */ '0   0      1      0     0',
            /* C */ '0   0      0      1     0',
            /* D */ '0   0      0      0     1',
            /* E */ '0   0      0      0     0'
        ]);

        const mindmap = new Mindmap();
        
        mindmap.root = root;
        nodes.forEach(n => mindmap.ideas.set(n.id, n));
        links.forEach(l => mindmap.associations.set(l.id, l));
    
        const state = {model: {mindmap}};

        // setup patch (add cross-association)
        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'A to C',
                    fromId: 'A',
                    toId: 'C',
                    weight: 1
                })
            }});

        // target
        mutate(state, patch);

        // check
        const ideaA = mindmap.ideas.get('A');
        const ideaB = mindmap.ideas.get('B');
        const ideaC = mindmap.ideas.get('C');
        const ideaD = mindmap.ideas.get('D');
        const ideaE = mindmap.ideas.get('E');

        const assocAtoB = mindmap.associations.get('A to B');
        const assocAtoC = mindmap.associations.get('A to C');
        const assocAtoE = mindmap.associations.get('A to E');
        const assocCtoD = mindmap.associations.get('C to D');

        expect(ideaA.rootPathWeight).to.equal(0);
        expect(ideaB.rootPathWeight).to.equal(1);
        expect(ideaC.rootPathWeight).to.equal(1); // updated
        expect(ideaD.rootPathWeight).to.equal(2); // updated
        expect(ideaE.rootPathWeight).to.equal(1);

        expect(ideaA.linkFromParent).to.equal(null);
        expect(ideaA.linksToChilds).to.have.length(3); // updated
        expect(ideaA.linksToChilds)
            .to.have.members([assocAtoB, assocAtoC, assocAtoE]);

        expect(ideaB.linkFromParent).to.equal(assocAtoB);
        expect(ideaB.linksToChilds).to.have.length(0); // updated

        expect(ideaC.linkFromParent).to.equal(assocAtoC); // updated
        expect(ideaC.linksToChilds).to.have.length(1);
        expect(ideaC.linksToChilds).to.have.members([assocCtoD]);

        expect(ideaD.linkFromParent).to.equal(assocCtoD);
        expect(ideaD.linksToChilds).to.have.length(0);

        expect(ideaE.linkFromParent).to.equal(assocAtoE);
        expect(ideaE.linksToChilds).to.have.length(0);
    });

    it('should fail if head idea was not found', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const tailIdea = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(tailIdea.id, tailIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    fromId: 'XXX',
                    toId: 'tail',
                    weight: 1
                })
            }});

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Head idea 'XXX' was not found for association`);
    });

    it('should NOT fail if tail idea was not found', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    fromId: 'head',
                    toId: 'tail',
                    weight: 1
                })
            }});

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.not.throw();
    });

});