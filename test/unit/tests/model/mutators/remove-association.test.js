import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('remove-association', () => {
    
    it('should remove association from map', () => {

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

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'die'}
        });

        // target
        mutate(state, patch);

        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0].id).to.equal('live');
    });

    it('should remove outgoing association from head idea', () => {
        
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

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'die'}
        });

        // target
        mutate(state, patch);

        // check
        const idea = state.model.mindmap.ideas.get('head');
        expect(idea.associationsOut).to.be.empty;
    });

    it('should remove association between head and tail ideas', () => {
        
        // setup graph
        //
        //  (root) --> (head) --> (tail)
        //    |                     ^
        //    -----------------------
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});
        const ideaTail = new Idea({id: 'tail'});

        const assocRootToHead = new Association({
            id: 'root to head',
            from: ideaRoot,
            to: ideaHead
        });

        const assocRootToTail = new Association({
            id: 'root to tail',
            from: ideaRoot,
            to: ideaTail
        });

        const assocHeadToTail = new Association({
            id: 'head to tail',
            from: ideaHead,
            to: ideaTail
        });

        ideaRoot.associationsOut = [assocRootToHead, assocRootToTail];
        ideaHead.associationsIn = [assocRootToHead];
        ideaHead.associationsOut = [assocHeadToTail];
        ideaTail.associationsIn = [assocHeadToTail, assocRootToTail];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.associations.set(assocRootToHead.id, assocRootToHead);
        mindmap.associations.set(assocRootToTail.id, assocRootToTail);
        mindmap.associations.set(assocHeadToTail.id, assocHeadToTail);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'head to tail'}
        });

        // target
        mutate(state, patch);

        // check
        const head = state.model.mindmap.ideas.get('head');
        const tail = state.model.mindmap.ideas.get('tail');

        expect(head.associationsOut).to.be.empty;
        expect(tail.associationsIn).to.have.length(1);
        expect(tail.associationsIn[0].id).to.equal('root to tail');
    });

    it('should fail if association was not found', () => {
        
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

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'die'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Association 'die' was not found`);
    });

    it('should fail if association miss reference to head idea', () => {
        
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

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'die'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Association 'die' has no reference to head idea`);
    });

    it('should fail if last association for tail idea ', () => {
        
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
            to: ideaTail
        });

        ideaRoot.associationsOut = [assocLive];
        ideaHead.associationsOut = [assocDie];
        ideaTail.associationsIn = [assocDie];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.associations.set(assocLive.id, assocLive);
        mindmap.associations.set(assocDie.id, assocDie);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'die'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Association 'die' cannot be removed because ` +
            `it is the last incoming association for idea 'tail'`);
    });

    it('should fail if head idea miss reference to association', () => {
        
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

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'die'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Head idea 'head' has no reference ` +
            `to outgoing association 'die'`);
    });

    it('should fail if tail idea miss reference to association', () => {
        
        // setup graph
        //
        //  (root) --> (head) --> (tail)
        //    |                     ^
        //    -----------------------
        //
        const mindmap = new Mindmap();

        const ideaRoot = new Idea({id: 'root', isRoot: true});
        const ideaHead = new Idea({id: 'head'});
        const ideaTail = new Idea({id: 'tail'});

        const assocRootToHead = new Association({
            id: 'root to head',
            from: ideaRoot,
            to: ideaHead
        });

        const assocRootToTail = new Association({
            id: 'root to tail',
            from: ideaRoot,
            to: ideaTail
        });

        const assocHeadToTail = new Association({
            id: 'head to tail',
            from: ideaHead,
            to: ideaTail
        });

        ideaRoot.associationsOut = [assocRootToHead, assocRootToTail];
        ideaHead.associationsIn = [assocRootToHead];
        ideaHead.associationsOut = [assocHeadToTail];

        // target incoming association missed (same assoc twice)
        ideaTail.associationsIn = [assocRootToTail, assocRootToTail];

        mindmap.ideas.set(ideaRoot.id, ideaRoot);
        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.associations.set(assocRootToHead.id, assocRootToHead);
        mindmap.associations.set(assocRootToTail.id, assocRootToTail);
        mindmap.associations.set(assocHeadToTail.id, assocHeadToTail);
        mindmap.root = ideaRoot;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove-association',
            data: {id: 'head to tail'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Tail idea 'tail' has no reference to ` +
            `incoming association 'head to tail'`);
    });
});