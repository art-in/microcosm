import {expect} from 'test/utils';
import clone from 'clone';

import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('set-idea-color', () => {
    
    it('should set idea color', () => {

        // setup
        const idea = new Idea({
            id: 'idea',
            color: 'black'
        });

        const mindset = new Mindset();
        mindset.ideas.set(idea.id, idea);

        const state = {model: {mindset}};

        // target
        const patch = handle(state, {
            type: 'set-idea-color',
            data: {
                ideaId: 'idea',
                color: 'white'
            }
        });

        // check
        expect(patch).to.have.length(1);
        expect(patch['update-idea']).to.exist;
        expect(patch['update-idea'][0].data).to.deep.equal({
            id: 'idea',
            color: 'white'
        });

    });

    it('should NOT mutate state', () => {
        
        // setup
        const idea = new Idea({
            id: 'idea',
            color: 'black'
        });

        const mindset = new Mindset();
        mindset.ideas.set(idea.id, idea);

        const state = {model: {mindset}};
        const stateBefore = clone(state);

        // target
        handle(state, {
            type: 'set-idea-color',
            data: {
                ideaId: 'idea',
                color: 'white'
            }
        });

        // check
        expect(state).to.deep.equal(stateBefore);
    });

    it('should target all state layers', () => {

        // setup
        const mindset = new Mindset();
        mindset.ideas.set('id', new Idea({
            id: 'id',
            color: 'black'
        }));

        const state = {model: {mindset}};

        // target
        const patch = handle(state, {
            type: 'set-idea-color',
            data: {
                ideaId: 'id',
                color: 'white'
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});