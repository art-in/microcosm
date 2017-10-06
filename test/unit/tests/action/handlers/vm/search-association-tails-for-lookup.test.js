import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import LookupSuggestion from 'vm/shared/LookupSuggestion';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('search-association-tails-for-lookup', () => {

    it('should set suggestions to lookup', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            isRoot: true,
            value: 'idea'
        });
        const ideaTail = new Idea({
            id: 'tail',
            value: 'idea'
        });

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'search-association-tails-for-lookup', {
                phrase: 'idea',
                headIdeaId: 'head'
            }, state);

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];
               
        expect(type).to.equal('set-suggestions-to-association-tails-lookup');
        expect(data.suggestions).to.have.length(1);
        expect(data.suggestions[0]).to.be.instanceOf(LookupSuggestion);
        expect(data.suggestions[0].data).to.deep.equal({ideaId: 'tail'});
    });

    it('should NOT set head idea', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            value: 'idea'
        });
        const ideaTail = new Idea({
            id: 'tail',
            value: 'idea'
        });

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'search-association-tails-for-lookup', {
                phrase: 'idea',
                headIdeaId: 'head'
            }, state);

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('set-suggestions-to-association-tails-lookup');
        expect(data.suggestions).to.have.length(1);
        expect(data.suggestions[0].data.ideaId).to.equal('tail');
    });

    it('should NOT set child ideas', async () => {

        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            value: 'idea'
        });
        const ideaTail = new Idea({
            id: 'tail',
            value: 'idea'
        });

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
        const patch = await dispatch(
            'search-association-tails-for-lookup', {
                phrase: 'idea',
                headIdeaId: 'head'
            }, state);

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('set-suggestions-to-association-tails-lookup');
        expect(data.suggestions).to.have.length(0);
    });

    it('should NOT set parent ideas', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            value: 'idea'
        });
        const ideaTail = new Idea({
            id: 'tail',
            value: 'idea'
        });

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
        const patch = await dispatch(
            'search-association-tails-for-lookup', {
                phrase: 'idea',
                headIdeaId: 'tail'
            }, state);

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('set-suggestions-to-association-tails-lookup');
        expect(data.suggestions).to.have.length(0);
    });

    it('should NOT set root idea', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            value: 'idea'
        });
        const ideaTail = new Idea({
            id: 'tail',
            isRoot: true,
            value: 'idea'
        });

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);

        mindmap.root = ideaTail;

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'search-association-tails-for-lookup', {
                phrase: 'idea',
                headIdeaId: 'head'
            }, state);

        // check
        expect(patch).to.have.length(1);
        const {type, data} = patch[0];

        expect(type).to.equal('set-suggestions-to-association-tails-lookup');
        expect(data.suggestions).to.have.length(0);
    });

    it('should target only vm and view state layers', async () => {
        
        // setup
        const mindmap = new Mindmap({id: 'm'});
        
        const ideaHead = new Idea({
            id: 'head',
            isRoot: true,
            value: 'idea #NOTFOUND#'
        });
        const ideaTail = new Idea({
            id: 'tail',
            value: 'idea #FOUND#'
        });

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch(
            'search-association-tails-for-lookup', {
                phrase: '#FOUND#',
                headIdeaId: 'head'
            }, state);

        // check
        expect(patch.hasTarget('data')).to.be.false;
        expect(patch.hasTarget('model')).to.be.false;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});