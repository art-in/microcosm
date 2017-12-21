import {expect} from 'test/utils';
import clone from 'clone';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('set-idea-title-and-value', () => {
    
    it('should update idea title and value', () => {
        
        // setup
        const idea = new Idea({
            id: 'idea',
            title: 'old title',
            value: 'old value'
        });

        const mindmap = new Mindmap();
        mindmap.ideas.set(idea.id, idea);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-title-and-value',
            data: {
                ideaId: 'idea',
                title: 'new title',
                value: 'new value'
            }
        });

        // check
        expect(patch).to.have.length(1);
        expect(patch['update-idea']).to.exist;
        expect(patch['update-idea'][0].data).to.deep.equal({
            id: 'idea',
            title: 'new title',
            value: 'new value'
        });
    });

    it('should not mutate if same value', () => {
        
        // setup
        const idea = new Idea({
            id: 'idea',
            title: 'same title',
            value: 'same value'
        });

        const mindmap = new Mindmap();
        mindmap.ideas.set(idea.id, idea);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-title-and-value',
            data: {
                ideaId: 'idea',
                title: 'same title',
                value: 'same value'
            }
        });

        // check
        expect(patch).to.have.length(0);
    });

    it('should NOT mutate state', () => {

        // setup
        const idea = new Idea({
            id: 'idea'
        });

        const mindmap = new Mindmap();
        mindmap.ideas.set(idea.id, idea);

        const state = {model: {mindmap}};
        const stateBefore = clone(state);

        // target
        handle(state, {
            type: 'set-idea-title-and-value',
            data: {
                ideaId: 'idea',
                title: 'title',
                value: 'value'
            }
        });

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should target all state layers', () => {

        // setup
        const idea = new Idea({
            id: 'idea'
        });

        const mindmap = new Mindmap();
        mindmap.ideas.set(idea.id, idea);

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-title-and-value',
            data: {
                ideaId: 'idea',
                title: 'title',
                value: 'value'
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });
    
});