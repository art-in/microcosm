import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('remove association', () => {
    
    it('should remove association from map', async () => {

        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            fromId: 'root',
            from: ideaRoot,
            toId: 'head',
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            fromId: 'head',
            from: ideaHead,
            toId: null,
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];
        ideaHead.associationsIn = [assocLive];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const result = await mutate(state, patch);
        const assocs = values(result.model.mindmap.associations);

        // check
        expect(assocs).to.have.length(1);
        expect(assocs[0].id).to.equal('live');
    });

    it('should remove association from head idea', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: ideaHead,
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const result = await mutate(state, patch);

        // check
        const idea = result.model.mindmap.ideas.get('head');
        expect(idea.associationsOut).to.be.empty;
    });

    it('should fail if association was not found', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const rootIdea = new Idea({id: 'root', isRoot: true});
        const headIdea = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: rootIdea,
            to: headIdea
        });

        rootIdea.associationsOut = [assocLive];
        headIdea.associationsOut = [];

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(headIdea.id, headIdea);

        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'die' was not found`);
    });

    it('should fail if association has no head idea', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: null, // no head idea
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'die' has no reference to head idea`);
    });

    it('should fail if association has tail idea', async () => {
        
        // setup graph
        //
        //  (root) --> (head) --> (tail)
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});
        const ideaTail = new Idea({id: 'tail'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: ideaHead,
            to: ideaTail // has reference to tail
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'die' cannot be removed ` +
            `because it has reference to tail idea`);
    });

    it('should fail if head idea has no association', async () => {
        
        // setup graph
        //
        //  (root) --> (head) -->
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});

        const assocLive = new Association({
            id: 'live',
            from: ideaRoot,
            to: ideaHead
        });

        const assocDie = new Association({
            id: 'die',
            from: ideaHead,
            to: null
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = []; // no association to remove

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch(
            'remove association',
            {id: 'die'}
        );

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Head idea 'head' has no reference ` +
            `to outgoing association 'die'`);
    });
});