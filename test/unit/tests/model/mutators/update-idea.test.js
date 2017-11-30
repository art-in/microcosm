import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import mutate from 'model/mutators';

describe('update-idea', () => {
    
    it('should update idea', () => {

        // setup
        const mindmap = new Mindmap();
        
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            value: 'old',
            color: 'white'
        }));

        const state = new State();
        state.model.mindmap = mindmap;

        const patch = new Patch({
            type: 'update-idea',
            data: {id: 'id', value: 'new'}
        });

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.have.length(1);
        expect(ideas[0]).to.containSubset({
            id: 'id',
            value: 'new',
            color: 'white'
        });
    });

    it('should fail if target idea was not found', () => {

        // setup
        const state = new State();
        state.model.mindmap = new Mindmap();
        
        const patch = new Patch({
            type: 'update-idea',
            data: {id: 'id', value: 'new'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(`Idea 'id' was not found`);
    });

});