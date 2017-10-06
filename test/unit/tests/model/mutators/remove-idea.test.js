import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('remove idea', () => {
    
    it('should remove idea from ideas map', async () => {

        // setup graph
        //
        //         (root)
        //        /       \
        //        v       v
        //     (live) --> (die)
        //
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root', isRoot: true});
        const ideaLive = new Idea({id: 'live'});
        const ideaDie = new Idea({id: 'die'});

        const assocRootToLive = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'live',
            to: ideaLive
        });

        const assocLiveToDie = new Association({
            fromId: 'live',
            from: ideaLive,
            toId: 'die',
            to: ideaDie
        });

        const assocRootToDie = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'die',
            to: ideaDie
        });

        rootIdea.associationsOut = [assocRootToDie, assocRootToLive];
        ideaLive.associationsOut = [assocLiveToDie];

        ideaLive.associationsIn = [assocRootToLive];
        ideaDie.associationsIn = [assocLiveToDie, assocRootToDie];

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(ideaLive.id, ideaLive);
        mindmap.ideas.set(ideaDie.id, ideaDie);

        mindmap.associations.set(assocRootToLive.id, assocRootToLive);
        mindmap.associations.set(assocLiveToDie.id, assocLiveToDie);
        mindmap.associations.set(assocRootToDie.id, assocRootToDie);

        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove idea',
            data: {id: 'die'}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = values(result.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([
            {id: 'root'},
            {id: 'live'}
        ]);
    });

    it('should remove idea from incoming associations', async () => {

        // setup graph
        //
        //         (root)
        //        /       \
        //        v       v
        //     (live) --> (die)
        //
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root', isRoot: true});
        const ideaLive = new Idea({id: 'live'});
        const ideaDie = new Idea({id: 'die'});

        const assocRootToLive = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'live',
            to: ideaLive
        });

        const assocLiveToDie = new Association({
            fromId: 'live',
            from: ideaLive,
            toId: 'die',
            to: ideaDie
        });

        const assocRootToDie = new Association({
            fromId: 'root',
            from: rootIdea,
            toId: 'die',
            to: ideaDie
        });

        rootIdea.associationsOut = [assocRootToDie, assocRootToLive];
        ideaLive.associationsOut = [assocLiveToDie];

        ideaLive.associationsIn = [assocRootToLive];
        ideaDie.associationsIn = [assocLiveToDie, assocRootToDie];

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(ideaLive.id, ideaLive);
        mindmap.ideas.set(ideaDie.id, ideaDie);

        mindmap.associations.set(assocRootToLive.id, assocRootToLive);
        mindmap.associations.set(assocLiveToDie.id, assocLiveToDie);
        mindmap.associations.set(assocRootToDie.id, assocRootToDie);

        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove idea',
            data: {id: 'die'}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const assocs = values(result.model.mindmap.associations);

        expect(assocs).to.have.length(3);
        expect(assocs).to.containSubset([{
            from: {id: 'root'},
            to: {id: 'live'}
        }, {
            from: {id: 'root'},
            toId: null,
            to: null
        }, {
            from: {id: 'live'},
            toId: null,
            to: null
        }]);
    });

    it('should fail if no incoming associations found', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root'});
        const ideaDie = new Idea({id: 'die'});

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.ideas.set(ideaDie.id, ideaDie);
        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove idea',
            data: {id: 'die'}
        });

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `No incoming associations found for idea 'die'`);
    });

    it('should NOT fail if no incoming associations for root', async () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const rootIdea = new Idea({id: 'root', isRoot: true});

        mindmap.ideas.set(rootIdea.id, rootIdea);
        mindmap.root = rootIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove idea',
            data: {id: 'root'}
        });

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.not.be.rejectedWith();
    });
});