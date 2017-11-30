import {expect} from 'test/utils';

import mutate from 'model/mutators';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Point from 'src/model/entities/Point';

describe('update-mindmap', () => {

    it('should update mindmap', () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1,
            pos: new Point({x: 100, y: 0})
        });

        const state = new State();
        state.model.mindmap = mindmap;
        
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
            pos: {x: 100}
        });
    });

});