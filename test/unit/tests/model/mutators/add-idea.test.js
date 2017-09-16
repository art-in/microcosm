import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('add idea', () => {
    
    it('should add idea to ideas map', async () => {

        // setup
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const assoc = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1'
        });
        rootIdea.associationsOut = [assoc];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const result = await mutate(state, patch);
        const ideas = values(result.model.mindmap.ideas);

        // check
        expect(ideas).to.have.length(2);
        expect(ideas[1]).to.containSubset({
            id: 'idea 1',
            value: 'test'
        });
    });

    it('should set idea to incoming associations', async () => {
        
        // setup graph
        //
        // (root) --> (idea 1) --> (idea X)
        //    |                        ^
        //    --------------------------
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const idea1 = new Idea({
            id: 'idea 1',
            depth: 1
        });

        const assoc1 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1',
            to: idea1
        });
        const assoc2 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea X'
        });
        const assoc3 = new Association({
            fromId: 'idea 1',
            from: idea1,
            toId: 'idea X'
        });
        rootIdea.associationsOut = [assoc1, assoc2];
        idea1.associationsIn = [assoc1];
        idea1.associationsOut = [assoc3];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(idea1.id, idea1);
        mindmap.associations.set(assoc1.id, assoc1);
        mindmap.associations.set(assoc2.id, assoc2);
        mindmap.associations.set(assoc3.id, assoc3);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea X'})
        );

        // target
        const result = await mutate(state, patch);

        // check
        const associations = values(result.model.mindmap.associations);

        expect(associations).to.have.length(3);
        expect(associations).to.containSubset([{
            from: {id: 'root'},
            to: {id: 'idea X'}
        }, {
            from: {id: 'idea 1'},
            to: {id: 'idea X'}
        }]);
    });

    it('should set incoming associations to idea', async () => {
        
        // setup graph
        //
        // (root) --> (idea 1) --> (idea X)
        //    |                        ^
        //    --------------------------
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const idea1 = new Idea({
            id: 'idea 1',
            depth: 1
        });

        const assoc1 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1',
            to: idea1
        });
        const assoc2 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea X'
        });
        const assoc3 = new Association({
            fromId: 'idea 1',
            from: idea1,
            toId: 'idea X'
        });
        rootIdea.associationsOut = [assoc1, assoc2];
        idea1.associationsIn = [assoc1];
        idea1.associationsOut = [assoc3];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(idea1.id, idea1);
        mindmap.associations.set(assoc1.id, assoc1);
        mindmap.associations.set(assoc2.id, assoc2);
        mindmap.associations.set(assoc3.id, assoc3);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea X'})
        );

        // target
        const result = await mutate(state, patch);
        const idea = result.model.mindmap.ideas.get('idea X');
        
        // check
        expect(idea.associationsIn).to.have.length(2);
        expect(idea.associationsIn).to.containSubset([{
            from: {id: 'root'},
            to: {id: 'idea X'}
        }, {
            from: {id: 'idea 1'},
            to: {id: 'idea X'}
        }]);
    });

    it('should set empty outgoing associations to idea', async () => {
        
        // setup
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const assoc = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1'
        });
        rootIdea.associationsOut = [assoc];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const result = await mutate(state, patch);
        const ideas = values(result.model.mindmap.ideas);

        // check
        expect(ideas).to.have.length(2);
        expect(ideas[1].associationsOut).to.be.empty;
    });

    it('should set idea depth', async () => {
        
        // setup graph
        //
        // (root) --> (idea 1) --> (idea X)
        //    |                        ^
        //    --------------------------
        //
        const rootIdea = new Idea({
            id: 'root',
            isRoot: true,
            depth: 0
        });
        const idea1 = new Idea({
            id: 'idea 1',
            depth: 1
        });

        const assoc1 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1',
            to: idea1
        });
        const assoc2 = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea X'
        });
        const assoc3 = new Association({
            fromId: 'idea 1',
            from: idea1,
            toId: 'idea X'
        });

        rootIdea.associationsOut = [assoc1, assoc2];
        idea1.associationsIn = [assoc1];
        idea1.associationsOut = [assoc3];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(idea1.id, idea1);
        mindmap.associations.set(assoc1.id, assoc1);
        mindmap.associations.set(assoc2.id, assoc2);
        mindmap.associations.set(assoc3.id, assoc3);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea X'})
        );

        // target
        const result = await mutate(state, patch);
        const ideas = values(result.model.mindmap.ideas);

        // check
        expect(ideas).to.containSubset([{
            id: 'idea X',
            depth: 1
        }]);
    });

    it('should set root idea depth to zero', async () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'root', isRoot: true})
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.containSubset([{
            id: 'root',
            depth: 0
        }]);
    });

    it('should fail if mindmap already has root idea', async () => {
        
        // setup
        const rootIdea = new Idea({id: 'root', isRoot: true});
        
        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        
        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'root', isRoot: true})
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            'Mindmap already has root idea');
    });

    it('should fail if no incoming associations was found', async () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `No incoming associations found for idea 'idea 1'`);
    });

    it('should NOT fail if no incoming association for root', async () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'root', isRoot: true})
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(1);
        expect(result.model.mindmap.root).to.containSubset({
            id: 'root'
        });
    });

    it('should fail if parent idea does not have depth', async () => {
        
        // setup
        const rootIdea = new Idea({id: 'root'});
        const assoc = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'idea 1'
        });
        rootIdea.associationsOut = [assoc];

        const mindmap = new Mindmap();
        mindmap.root = rootIdea;
        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.associations.set(assoc.id, assoc);

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add idea',
            new Idea({id: 'idea 1', value: 'test'})
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Parent idea 'root' does not have depth`);
    });
});