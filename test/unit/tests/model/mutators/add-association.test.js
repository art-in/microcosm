import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Association from 'src/model/entities/Association';

import mutate from 'model/mutators';

describe('add-association', () => {

    it('should add association to mindmap', () => {

        // setup
        const state = new State();
        state.model.mindmap = new Mindmap();
    
        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    value: 'val'
                })
            }
        });
    
        // target
        mutate(state, patch);
    
        // check
        const assocs = values(state.model.mindmap.associations);
    
        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'assoc',
            value: 'val'
        });
    });

});