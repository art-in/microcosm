import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindset from 'src/model/entities/Mindset';
import Idea from 'src/model/entities/Idea';

import mutate from 'model/mutators';

describe('add-idea', () => {

    it('should add idea to mindset', () => {
        
        // setup
        const state = new State();
        state.model.mindset = new Mindset();
    
        const patch = new Patch({
            type: 'add-idea',
            data: {
                idea: new Idea({
                    id: 'idea',
                    value: 'val'
                })
            }
        });
    
        // target
        mutate(state, patch);
    
        // check
        const ideas = values(state.model.mindset.ideas);
    
        expect(ideas).to.have.length(1);
        expect(ideas[0]).to.containSubset({
            id: 'idea',
            value: 'val'
        });
    });

});