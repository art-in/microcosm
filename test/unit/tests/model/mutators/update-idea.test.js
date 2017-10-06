import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

describe('update idea', () => {
    
    it('should update idea', async () => {

        // setup
        const mindmap = new Mindmap();
        
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'old',
            color: 'white'
        }));

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'update idea',
            data: {id: 'id', value: 'new'}
        });

        // target
        const result = await mutate(state, patch);

        // check
        const ideas = result.model.mindmap.ideas;

        expect([...ideas]).to.have.length(1);
        expect(ideas.get('id')).to.containSubset({
            id: 'id',
            value: 'new',
            color: 'white'
        });
    });

    it('should fail if target idea was not found', async () => {

        // setup
        const state = {model: {mindmap: new Mindmap()}};
        
        const patch = new Patch({
            type: 'update idea',
            data: {id: 'id', value: 'new'}
        });

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Idea 'id' was not found`);
    });

});