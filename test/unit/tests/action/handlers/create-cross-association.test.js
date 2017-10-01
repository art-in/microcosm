import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('create-cross-association', () => {

    it('should add association to mindmap', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'create-cross-association', {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }, state);

        // check
        expect(patch).to.have.length(1);

        expect(patch[0].type).to.equal('add association');
        expect(patch[0].data).to.be.instanceOf(Association);
        expect(patch[0].data.mindmapId).to.equal('m');
        expect(patch[0].data.fromId).to.equal('head');
        expect(patch[0].data.toId).to.equal('tail');
    });

    it('should target all state layers', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'create-cross-association', {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }, state);

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

    it('should fail if head ideas was not found', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaTail;

        const state = {model: {mindmap}};

        // target
        const promise = dispatch(
            'create-cross-association', {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }, state);

        // check
        expect(promise).to.be.rejectedWith(
            `Head idea 'head' was not found for cross-association`);
    });

    it('should fail if tail ideas was not found', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({id: 'head', isRoot: true});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const promise = dispatch(
            'create-cross-association', {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }, state);

        // check
        expect(promise).to.be.rejectedWith(
            `Tail idea 'tail' was not found for cross-association`);
    });

    it('should fail if self-association', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const promise = dispatch(
            'create-cross-association', {
                headIdeaId: 'head',
                tailIdeaId: 'head'
            }, state);

        // check
        expect(promise).to.be.rejectedWith(
            `Unable to add self-association on idea 'head'`);
    });

    it('should fail if duplicate association', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        const assoc = new Association({
            fromId: 'head',
            from: ideaHead,
            toId: 'tail',
            to: ideaTail
        });

        ideaHead.associationsOut = [assoc];
        ideaTail.associationsIn = [assoc];

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.associations.set(assoc.id, assoc);

        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const promise = dispatch(
            'create-cross-association', {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }, state);

        // check
        expect(promise).to.be.rejectedWith(
            `Unable to create duplicate association ` +
            `between ideas 'head' and 'tail'`);
    });

    it('should fail if association to parent', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        const assoc = new Association({
            fromId: 'head',
            from: ideaHead,
            toId: 'tail',
            to: ideaTail
        });

        ideaHead.associationsOut = [assoc];
        ideaTail.associationsIn = [assoc];

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.associations.set(assoc.id, assoc);

        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const promise = dispatch(
            'create-cross-association', {
                headIdeaId: 'tail',
                tailIdeaId: 'head'
            }, state);

        // check
        expect(promise).to.be.rejectedWith(
            `Unable to create association from idea 'tail' ` +
            `to its parent idea 'head'`);
    });

    it('should fail if association to root', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaHead = new Idea({id: 'head'});
        const ideaTail = new Idea({id: 'tail', isRoot: true});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);

        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const promise = dispatch(
            'create-cross-association', {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }, state);

        // check
        expect(promise).to.be.rejectedWith(
            `Unable to create association from idea 'head' ` +
            `to root idea 'tail'`);
    });

});