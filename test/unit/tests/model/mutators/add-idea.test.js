import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('add-idea', () => {
    
    it('should add idea to ideas map', () => {

        // setup
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            rootPathWeight: 0,
            linksToChilds: []
        });
        const assocAtoB = new Association({
            fromId: ideaA.id,
            from: ideaA,
            toId: 'B',
            weight: 1
        });
        ideaA.associationsOut = [assocAtoB];

        const mindmap = new Mindmap();
        mindmap.root = ideaA;
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.associations.set(assocAtoB.id, assocAtoB);

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'B', value: 'test'})
            }});

        // target
        mutate(state, patch);

        // check
        const ideaB = mindmap.ideas.get('B');

        expect(ideaB).to.exist;
        expect(ideaB.value).to.equal('test');
    });

    it('should set idea to incoming associations', () => {
        
        // setup graph
        //
        //   (A) --> (B) --> (C)*new
        //    |_______________^
        //
        //
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            rootPathWeight: 0
        });
        const ideaB = new Idea({
            id: 'B',
            rootPathWeight: 1
        });

        const assocAtoB = new Association({
            id: 'A to B',
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaB.id,
            to: ideaB,
            weight: 1
        });
        const assocAtoC = new Association({
            id: 'A to C',
            fromId: ideaA,
            from: ideaA,
            toId: 'C',
            weight: 1
        });
        const assocBtoC = new Association({
            id: 'B to C',
            fromId: ideaB.id,
            from: ideaB,
            toId: 'C',
            weight: 1
        });

        ideaA.associationsOut = [assocAtoB, assocAtoC];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];

        ideaA.linkFromParent = null;
        ideaA.linksToChilds = [assocAtoB];
        ideaB.linkFromParent = assocAtoB;
        ideaB.linksToChilds = [];

        const mindmap = new Mindmap();
        mindmap.root = ideaA;
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.associations.set(assocAtoB.id, assocAtoB);
        mindmap.associations.set(assocAtoC.id, assocAtoC);
        mindmap.associations.set(assocBtoC.id, assocBtoC);

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'C'})
            }});

        // target
        mutate(state, patch);

        // check
        const associations = values(state.model.mindmap.associations);

        expect(associations).to.have.length(3);
        expect(associations).to.containSubset([{
            from: {id: 'A'},
            to: {id: 'C'}
        }, {
            from: {id: 'B'},
            to: {id: 'C'}
        }]);
    });

    it('should set incoming associations to idea', () => {
        
        // setup graph
        //
        //   (A) --> (B) --> (C)*new
        //    |_______________^
        //
        //
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            rootPathWeight: 0
        });
        const ideaB = new Idea({
            id: 'B',
            rootPathWeight: 1
        });

        const assocAtoB = new Association({
            id: 'A to B',
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaB.id,
            to: ideaB,
            weight: 1
        });
        const assocAtoC = new Association({
            id: 'A to C',
            fromId: ideaA,
            from: ideaA,
            toId: 'C',
            weight: 1
        });
        const assocBtoC = new Association({
            id: 'B to C',
            fromId: ideaB.id,
            from: ideaB,
            toId: 'C',
            weight: 1
        });

        ideaA.associationsOut = [assocAtoB, assocAtoC];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];

        ideaA.linkFromParent = null;
        ideaA.linksToChilds = [assocAtoB];
        ideaB.linkFromParent = assocAtoB;
        ideaB.linksToChilds = [];

        const mindmap = new Mindmap();
        mindmap.root = ideaA;
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.associations.set(assocAtoB.id, assocAtoB);
        mindmap.associations.set(assocAtoC.id, assocAtoC);
        mindmap.associations.set(assocBtoC.id, assocBtoC);

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'C'})
            }});

        // target
        mutate(state, patch);
        
        // check
        const ideaC = state.model.mindmap.ideas.get('C');

        expect(ideaC.associationsIn).to.have.length(2);
        expect(ideaC.associationsIn).to.containSubset([{
            from: {id: 'A'},
            to: {id: 'C'}
        }, {
            from: {id: 'B'},
            to: {id: 'C'}
        }]);
    });

    it('should set empty outgoing associations to idea', () => {
        
        // setup graph
        //
        //   (A) --> (B) --> (C)*new
        //    |_______________^
        //
        //
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            rootPathWeight: 0
        });
        const ideaB = new Idea({
            id: 'B',
            rootPathWeight: 1
        });

        const assocAtoB = new Association({
            id: 'A to B',
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaB.id,
            to: ideaB,
            weight: 1
        });
        const assocAtoC = new Association({
            id: 'A to C',
            fromId: ideaA,
            from: ideaA,
            toId: 'C',
            weight: 1
        });
        const assocBtoC = new Association({
            id: 'B to C',
            fromId: ideaB.id,
            from: ideaB,
            toId: 'C',
            weight: 1
        });

        ideaA.associationsOut = [assocAtoB, assocAtoC];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];

        ideaA.linkFromParent = null;
        ideaA.linksToChilds = [assocAtoB];
        ideaB.linkFromParent = assocAtoB;
        ideaB.linksToChilds = [];

        const mindmap = new Mindmap();
        mindmap.root = ideaA;
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.associations.set(assocAtoB.id, assocAtoB);
        mindmap.associations.set(assocAtoC.id, assocAtoC);
        mindmap.associations.set(assocBtoC.id, assocBtoC);

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'C'})
            }});

        // target
        mutate(state, patch);

        // check
        const ideaC = mindmap.ideas.get('C');
        
        expect(ideaC.associationsOut).to.be.empty;
    });

    it('should set root path weight and parent-child refs', () => {
        
        // setup graph
        //
        //   (A) --> (B) --> (C)*new
        //     \______________^
        //    
        //
        const ideaA = new Idea({
            id: 'A',
            isRoot: true,
            rootPathWeight: 0
        });
        const ideaB = new Idea({
            id: 'B',
            rootPathWeight: 1
        });

        const assocAtoB = new Association({
            id: 'A to B',
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaB.id,
            to: ideaB,
            weight: 1
        });
        const assocAtoC = new Association({
            id: 'A to C',
            fromId: ideaA.id,
            from: ideaA,
            toId: 'C',
            weight: 1
        });
        const assocBtoC = new Association({
            id: 'B to C',
            fromId: ideaB.id,
            from: ideaB,
            toId: 'C',
            weight: 1
        });

        ideaA.associationsOut = [assocAtoB, assocAtoC];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];

        ideaA.linkFromParent = null;
        ideaA.linksToChilds = [assocAtoB];

        ideaB.linkFromParent = assocAtoB;
        ideaB.linksToChilds = [];

        const mindmap = new Mindmap();
        
        mindmap.root = ideaA;

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaC);

        mindmap.associations.set(assocAtoB.id, assocAtoB);
        mindmap.associations.set(assocAtoC.id, assocAtoC);
        mindmap.associations.set(assocBtoC.id, assocBtoC);

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'C'})
            }});

        // target
        mutate(state, patch);

        // check
        const ideaC = mindmap.ideas.get('C');

        expect(ideaA.rootPathWeight).to.equal(0);
        expect(ideaB.rootPathWeight).to.equal(1);
        expect(ideaC.rootPathWeight).to.equal(1);

        expect(ideaA.linkFromParent).to.equal(null);
        expect(ideaA.linksToChilds).to.have.length(2);
        expect(ideaA.linksToChilds).to.have.members([assocAtoB, assocAtoC]);

        expect(ideaB.linkFromParent).to.equal(assocAtoB);
        expect(ideaB.linksToChilds).to.have.length(0);
        
        expect(ideaC.linkFromParent).to.equal(assocAtoC);
        expect(ideaC.linksToChilds).to.have.length(0);
    });

    it('should set root path weight for root to zero', () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'root', isRoot: true})
            }});

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.containSubset([{
            id: 'root',
            rootPathWeight: 0
        }]);
    });

    it('should fail if mindmap already has root idea', () => {
        
        // setup
        const rootIdea = new Idea({id: 'root', isRoot: true});
        
        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        
        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'root', isRoot: true})
            }});

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            'Mindmap already has root idea');
    });

    it('should fail if no incoming associations was found', () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'idea 1', value: 'test'})
            }});

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `No incoming associations found for idea 'idea 1'`);
    });

    it('should NOT fail if no incoming association for root', () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'root', isRoot: true})
            }});

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.have.length(1);
        expect(state.model.mindmap.root).to.containSubset({
            id: 'root'
        });
    });

    it('should fail if incoming association does not have weight', () => {
        
        // setup
        const ideaA = new Idea({
            id: 'A',
            rootPathWeight: 0
        });
        const assocAtoB = new Association({
            id: 'A to B',
            fromId: ideaA.id,
            from: ideaA,
            toId: 'B'
        });
        ideaA.associationsOut = [assocAtoB];

        const mindmap = new Mindmap();
        mindmap.root = ideaA;
        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.associations.set(assocAtoB.id, assocAtoB);

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({id: 'B', value: 'test'})
            }});

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Link 'A to B' has invalid weight 'undefined'`);
    });

});