import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe(`'set-idea-value' action`, () => {
    
    it('should update idea value', async () => {
        
        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'old'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('set-idea-value', {
            ideaId: 'id',
            value: 'new'
        }, state);

        // check
        expect(patch).to.have.length(1);
        expect(patch['update idea']).to.exist;
        expect(patch['update idea'][0]).to.deep.equal({
            id: 'id',
            value: 'new'
        });
    });

    it('should not mutate if same value', async () => {
        
        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'same value'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('set-idea-value', {
            ideaId: 'id',
            value: 'same value'
        }, state);

        // check
        expect(patch).to.have.length(0);
    });
    
});