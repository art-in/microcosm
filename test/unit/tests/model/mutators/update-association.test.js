import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Association from 'src/model/entities/Association';

import mutate from 'model/mutators';

describe('update-association', () => {
    
    it('should update association', () => {

        // setup
        const mindmap = new Mindmap();

        mindmap.associations.set('id', new Association({
            id: 'id',
            value: 'old'
        }));

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'update-association',
            data: {id: 'id', value: 'new'}
        });

        // target
        mutate(state, patch);

        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'id',
            value: 'new'
        });
    });

    it('should fail if target association was not found', () => {
        
        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'update-association',
            data: {id: 'id', value: 'new'}
        });

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(`Association 'id' was not found`);
    });

});