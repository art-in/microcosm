import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';

describe('update-mindmap', () => {

    it('should update mindmap', () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            x: 100
        });

        const state = {model: {mindmap}};
        
        const patch = new Patch({
            type: 'update-mindmap',
            data: {id: 'id', scale: 2}
        });

        // target
        mutate(state, patch);

        // check
        expect(state.model.mindmap).to.containSubset({
            id: 'id',
            scale: 2,
            x: 100
        });
    });

});