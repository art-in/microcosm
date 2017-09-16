import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe('set-mindmap-position', () => {
    
    it('should set mindmap position', async () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            x: 100,
            y: 100
        });

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('set-mindmap-position', {
            mindmapId: 'id',
            pos: {
                x: 200,
                y: 200
            }
        }, state);

        // check
        expect(patch).to.have.length(1);
        expect(patch['update mindmap']).to.exist;
        expect(patch['update mindmap'][0]).to.deep.equal({
            id: 'id',
            x: 200,
            y: 200
        });

    });

});