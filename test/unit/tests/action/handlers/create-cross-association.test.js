import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';
import Point from 'src/model/entities/Point';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('create-cross-association', () => {

    it('should add association to mindmap', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            isRoot: true,
            pos: new Point({x: 0, y: 0})
        });

        const ideaTail = new Idea({
            id: 'tail',
            pos: new Point({x: 10, y: 10})
        });

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }
        });

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('add-association');
        expect(data.assoc).to.be.instanceOf(Association);
        expect(data.assoc.mindmapId).to.equal('m');
        expect(data.assoc.fromId).to.equal('head');
        expect(data.assoc.toId).to.equal('tail');
        expect(data.assoc.weight).to.be.closeTo(14, 0.2);
    });

    it('should target all state layers', () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            isRoot: true,
            pos: new Point({x: 0, y: 0})
        });

        const ideaTail = new Idea({
            id: 'tail',
            pos: new Point({x: 10, y: 10})
        });

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
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
        
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaTail;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }
        });

        // check
        expect(result).to.throw(
            `Head idea 'head' was not found for cross-association`);
    });

    it('should fail if tail ideas was not found', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({id: 'head', isRoot: true});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }
        });

        // check
        expect(result).to.throw(
            `Tail idea 'tail' was not found for cross-association`);
    });

    it('should fail if self-association', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaHead = new Idea({id: 'head', isRoot: true});
        const ideaTail = new Idea({id: 'tail'});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head',
                tailIdeaId: 'head'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to add self-association on idea 'head'`);
    });

    it('should fail if duplicate association', () => {
        
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
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to create duplicate association ` +
            `between ideas 'head' and 'tail'`);
    });

    it('should fail if association to parent', () => {
        
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
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'tail',
                tailIdeaId: 'head'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to create association from idea 'tail' ` +
            `to its parent idea 'head'`);
    });

    it('should fail if association to root', () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});

        const ideaHead = new Idea({id: 'head'});
        const ideaTail = new Idea({id: 'tail', isRoot: true});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);

        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const result = () => handle(state, {
            type: 'create-cross-association',
            data: {
                headIdeaId: 'head',
                tailIdeaId: 'tail'
            }
        });

        // check
        expect(result).to.throw(
            `Unable to create association from idea 'head' ` +
            `to root idea 'tail'`);
    });

});