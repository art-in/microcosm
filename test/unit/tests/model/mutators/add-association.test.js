import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('add association', () => {
    
    it('should add association to map', async () => {

        // setup
        const mindmap = new Mindmap();
        
        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                value: 'test',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);
        const assocs = values(result.model.mindmap.associations);

        // check
        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'assoc',
            value: 'test'
        });
    });

    it('should set head idea to association', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);
        const assocs = values(result.model.mindmap.associations);

        // check
        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            fromId: 'head',
            from: {id: 'head'}
        });
    });

    it('should set tail idea to association', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);

        // check
        const assocs = values(result.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            toId: 'tail',
            to: {id: 'tail'}
        });
    });

    it('should set association to head idea as outgoing', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'head',
            associationsOut: [{
                id: 'assoc'
            }]
        }]);
    });

    it('should set association to tail idea as incoming', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                id: 'assoc',
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'tail',
            associationsIn: [{
                id: 'assoc'
            }]
        }]);

    });

    it('should fail if head idea was not found', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const tailIdea = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(tailIdea.id, tailIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                fromId: 'XXX',
                toId: 'tail'
            })
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Head idea 'XXX' was not found for association`);
    });

    it('should NOT fail if tail idea was not found', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'add association',
            new Association({
                fromId: 'head',
                toId: 'tail'
            })
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.not.be.rejectedWith();
    });

});