import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('update-association', () => {
    
    it('should update association', async () => {

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
        await mutate(state, patch);

        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'id',
            value: 'new'
        });
    });

    it('should fail if target association was not found', async () => {
        
        // setup
        const mindmap = new Mindmap();

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'update-association',
            data: {id: 'id', value: 'new'}
        });

        // target
        const promise = mutate(state, patch);

        // check
        await expect(promise).to.be.rejectedWith(
            `Association 'id' was not found`);
    });

});