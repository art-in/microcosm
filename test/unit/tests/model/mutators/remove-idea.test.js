import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import mutate from 'model/mutators';

describe('remove-idea', () => {
    
    it('should remove idea from mindmap', () => {

        // setup
        const mindmap = new Mindmap();
        
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'old',
            color: 'white'
        }));

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'remove-idea',
            data: {id: 'id'}
        });

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.have.length(0);
    });

    it('should fail if target idea was not found', () => {

        // setup
        const state = {model: {mindmap: new Mindmap()}};
        
        const patch = new Patch({
            type: 'remove-idea',
            data: {id: 'id'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(`Idea 'id' was not found`);
    });

});