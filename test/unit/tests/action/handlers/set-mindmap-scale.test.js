import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';

import dispatcher from 'src/action/dispatcher';
const dispatch = dispatcher.dispatch.bind(dispatcher);

describe(`'set-mindmap-scale' action`, () => {
    
    it('should set mindmap scale', async () => {

        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1
        });

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('set-mindmap-scale', {
            mindmapId: 'id',
            scale: 2,
            pos: {}
        }, state);

        // check
        expect(patch).to.have.length(1);
        expect(patch['update mindmap']).to.exist;
        expect(patch['update mindmap'][0]).to.containSubset({
            id: 'id',
            scale: 2
        });

    });

    it('should set mindmap position', async () => {
        
        // setup
        const mindmap = new Mindmap({
            id: 'id',
            scale: 1
        });

        const state = {model: {mindmap}};

        // target
        const patch = await dispatch('set-mindmap-scale', {
            mindmapId: 'id',
            scale: 2,
            pos: {
                x: 100,
                y: 200
            }
        }, state);

        // check
        expect(patch).to.have.length(1);
        expect(patch['update mindmap']).to.exist;
        expect(patch['update mindmap'][0]).to.containSubset({
            id: 'id',
            x: 100,
            y: 200
        });

    });

});