import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import mutate from 'model/mutators';

describe('add-idea', () => {

    it('should add idea to mindmap', () => {
        
        // setup
        const state = {model: {mindmap: new Mindmap()}};
    
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
        const ideas = values(state.model.mindmap.ideas);
    
        expect(ideas).to.have.length(1);
        expect(ideas[0]).to.containSubset({
            id: 'idea',
            value: 'val'
        });
    });

});