import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Association from 'src/model/entities/Association';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('set-association-value', () => {
    
    it('should set association value', async () => {

        // setup
        const mindmap = new Mindmap();

        mindmap.associations.set('id', new Association({
            id: 'id',
            value: 'old'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch({
            type: 'set-association-value',
            data: {
                assocId: 'id',
                value: 'new'
            }
        }, state);

        // check
        expect(patch).to.have.length(1);

        expect(patch['update association']).to.exist;
        expect(patch['update association'][0].data).to.deep.equal({
            id: 'id',
            value: 'new'
        });
    });

    it('should target all state layers', async () => {
       
        // setup
        const mindmap = new Mindmap();
        
        mindmap.associations.set('id', new Association({
            id: 'id',
            value: 'old'
        }));

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch({
            type: 'set-association-value',
            data: {
                assocId: 'id',
                value: 'new'
            }
        }, state);

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});