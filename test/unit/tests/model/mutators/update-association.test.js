import {expect} from 'test/utils';

import values from 'src/utils/get-map-values';

import State from 'src/boot/client/State';
import Patch from 'src/utils/state/Patch';
import Mindset from 'src/model/entities/Mindset';
import Association from 'src/model/entities/Association';

import mutate from 'model/mutators';

describe('update-association', () => {
    
    it('should update association', () => {

        // setup
        const mindset = new Mindset();

        mindset.associations.set('id', new Association({
            id: 'id',
            value: 'old'
        }));

        const state = new State();
        state.model.mindset = mindset;

        const patch = new Patch({
            type: 'update-association',
            data: {id: 'id', value: 'new'}
        });

        // target
        mutate(state, patch);

        // check
        const assocs = values(state.model.mindset.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'id',
            value: 'new'
        });
    });

    it('should fail if target association was not found', () => {
        
        // setup
        const mindset = new Mindset();

        const state = new State();
        state.model.mindset = mindset;

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